# Hermes Agent 适配分析

> 2026-06-16 | 基于 graphify 知识图谱的结构化分析

## 背景

cc-thinking-skills 目前面向 Claude Code 设计（39 个思维模型技能 + 4 层评估框架）。Hermes Agent (`E:\GitHub\hermes-agent`) 是 Nous Research 的 MIT 许可自改进 AI agent，具备完整的技能系统、插件生态、MCP 客户端/服务端、子 agent 调度等能力。

本文档基于两个工程的 graphify 知识图谱交叉分析，提出 4 个适配方案。

---

## 核心差异矩阵

| 维度 | cc-thinking-skills (Claude Code) | Hermes Agent |
|------|------|------|
| **语言** | JavaScript (Node.js) | Python 3.11+ |
| **技能格式** | SKILL.md + YAML frontmatter (宽松) | SKILL.md + **必需** YAML frontmatter (agentskills.io 标准) |
| **技能加载** | 全部注入 system prompt | 渐进式披露：`skills_list` → `skill_view` |
| **评估框架** | 4 层 eval harness (droid + judge + stats) | 无等价物 |
| **模型调用** | `claude` CLI 二进制 | OpenAI 兼容 API（多 provider） |
| **技能市场** | 无 | Skills Hub (agentskills.io) |
| **身份配置** | `CLAUDE.md` / `AGENTS.md` | `SOUL.md` + workspace 发现 AGENTS.md |
| **插件系统** | `.claude/plugins/` | `plugin.yaml` + `register(ctx)` + 21 个生命周期钩子 |
| **MCP** | 仅客户端 | 客户端 + 服务端 (`hermes mcp serve`) |
| **Agent 调度** | 子 agent + worktree | `delegate_task` + Kanban 多 agent 队列 |

---

## 关键耦合点（来自图谱）

图谱分析显示，以下组件与 Claude Code 存在硬耦合：

| 耦合点 | 位置 | 严重度 | 说明 |
|--------|------|--------|------|
| **droid.js** | `evals/lib/droid.js` | 🔴 高 | God node #5，20 边，连接 10+ eval runner。唯一模型调用入口，硬编码 `claude` CLI |
| **ISOLATION_DISABLED_TOOLS** | `evals/lib/droid.js:46` | 🔴 高 | Claude Code 专用工具名列表 |
| **claude-sonnet-4-6** | `analysis/ELEVATE-OR-KILL-SYNTHESIS.md` | 🟡 中 | 评估框架标定在 Claude 模型上 |
| **CLAUDE.md / AGENTS.md** | 仓库根目录 | 🟡 中 | Claude Code 专用配置文件 |
| **Skill YAML 规范** | `CONTRIBUTING.md` | 🟡 中 | `name` + `description` <=200 字符，Claude Code 约定 |
| **Purple/Claude 品牌** | `assets/readme-banner.png` | 🟢 低 | 仅视觉品牌 |

**核心洞察：** 39 个技能的概念内容（Bayes 定律、系统杠杆点、OODA 循环等）是**平台无关的**——它们与 Claude Code 没有结构耦合。真正需要适配的是评估框架（droid.js + eval runners）和技能加载机制。

---

## 方案

### 方案 A：直接移植技能（推荐起步）

将 39 个 `skills/thinking-*/SKILL.md` 复制到 `~/.hermes/skills/thinking-*/`。

**需改动：**
- YAML frontmatter：添加 `metadata.hermes.tags`、`metadata.hermes.related_skills`
- 去掉 Claude Code 专用触发短语和工具调用模式
- 适配输出格式指引（Hermes 工具名、参数风格不同）

**无需改动：**
- 39 个思维模型的核心概念内容
- 7 大技能分类（决策、认知、系统、问题解决、估算、产品、元技能）

**代价：** 低。技能本身就是 markdown 知识。工作量 ~2-3 小时，主要是 frontmatter 适配。

**局限：** eval harness 不会移植，失去评估能力。技能成为静态参考。

---

### 方案 B：插件化打包

创建 Hermes 插件 `~/.hermes/plugins/cc-thinking-skills/`：

```yaml
# plugin.yaml
name: cc-thinking-skills
version: 1.0.0
description: "39 个思维模型技能，为 Hermes Agent 适配"
hooks:
  - pre_llm_call        # 注入相关技能上下文
  - on_session_start    # 初始技能注入
```

```python
# __init__.py
def register(ctx):
    # 运行时加载技能，利用 Hermes 渐进式披露按需注入
    # 可复现 model-router 的智能路由逻辑
    ctx.register_tool(skills_list_tool)
    ctx.register_tool(skill_view_tool)
```

**优势：**
- 利用 Hermes 插件钩子实现动态技能注入（相当于把 model-router 实现为插件）
- 技能文件最大程度保持原样
- 可通过 `metadata.hermes` 扩展字段支持 Hermes 特有功能

**代价：** 中。需要写 ~200-300 行 Python 适配代码。

---

### 方案 C：MCP 桥接

启动 graphify MCP 服务器，让 Hermes 通过 MCP 客户端查询技能知识图谱。

```bash
# 启动 MCP 服务器
cd e:/GitHub/cc-thinking-skills
graphify . --mcp
```

在 `~/.hermes/config.yaml` 注册：

```yaml
mcp_servers:
  thinking-skills:
    transport: stdio
    command: python
    args: ["-m", "graphify.serve", "e:/GitHub/cc-thinking-skills/graphify-out/graph.json"]
```

**优势：**
- **零代码改动**，立即可用
- 141× token 压缩（每次查询 ~3.7K tokens vs 527K 全文）
- Hermes 自动将 MCP 工具注册为 `mcp-thinking-skills` 工具集

**局限：**
- 技能是被动参考而非活跃引导（agent 需显式调用 MCP 工具）
- 不支持 eval harness

---

### 方案 D：全套移植（含评估框架）

将 eval harness 整体移植到 Python/Hermes 环境。

| 组件 | Claude Code 现状 | Hermes 等价物 |
|------|------|------|
| `droid.js` (模型调用) | `claude` CLI | Hermes API 直调 |
| `run-structural.js` (Tier 0) | Node.js 脚本 | Python `scripts/validate_skills.py` |
| `run-routing.js` (Tier 2) | droid + judge panel | `delegate_task` 子 agent |
| `run-behavioral.js` (Tier 3) | paired A/B | 同上 + `scipy.stats` 替代 stats.js |
| `stats.js` (统计) | JS 手写实现 | `scipy.stats.mcnemar` 等 |

**优势：** 最完整，保留 cc-thinking-skills 的评估严谨性（McNemar 检验、抗 p-hacking 门、复制验证）。

**代价：** 高。droid.js 是整个项目的最高桥接度 god node——替换它涉及重写 15+ 个 eval runner 的模型调用路径。工作量估计 1-2 周。

---

## 建议执行路径

```
现在 ──────────────────────────────────────────────────► 未来

  │ 方案 C               │ 方案 A + B              │ 方案 D
  │ MCP 桥接             │ 技能移植 + 插件化        │ 全套移植
  │ (零成本, 立即可用)    │ (2-3h + 半天)           │ (1-2 周, 按需)
  │                      │                         │
  ▼                      ▼                         ▼
 Hermes 能查            技能成为 Hermes             完整评估框架
 询技能图谱             原生能力                    在 Hermes 运行
```

1. **立即：方案 C** — graphify MCP 桥接，0 成本让 Hermes 能查询技能图谱
2. **短期：方案 A + B 结合** — 移植技能文件 + 插件化动态加载
3. **长期（按需）：方案 D** — 当需要在 Hermes 中复现技能评估管道时执行

---

## 相关资源

- [graphify-out/GRAPH_REPORT.md](../graphify-out/GRAPH_REPORT.md) — 知识图谱审计报告
- [graphify-out/graph.json](../graphify-out/graph.json) — 原始图谱数据
- [analysis/ELEVATE-OR-KILL-SCORECARD.md](ELEVATE-OR-KILL-SCORECARD.md) — 技能评分卡（规范真相源）
- [analysis/EVALUATION.md](EVALUATION.md) — 4 层评估框架设计文档
- Hermes Agent 仓库：`E:\GitHub\hermes-agent`
