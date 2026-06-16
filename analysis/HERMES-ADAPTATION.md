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

## 方案 A 与 C 的关系

A（插件化）和 C（eval harness）是**正交的**，可以且应该组合：

```
方案 A（插件）
  └─ 技能通过 plugin.yaml 注册
  └─ 渐进式披露注入 system prompt
  └─ Hermes 运行时使用技能 ←── 解决"怎么用"

方案 C（eval harness）
  └─ 读取同一批技能文件
  └─ 调用 Hermes API（替代 droid.js 的 claude CLI）
  └─ 跑 T0-T3 评估，输出评分卡 ←── 解决"好不好"
  └─ 不依赖 A 的插件机制，只依赖技能文件本身
```

C 的 eval harness 本质是**外部验证脚本**——读 SKILL.md 源文件、调模型、跑统计。跟技能是怎么加载到 agent 的没有耦合。droid.js 替换成 Hermes API 调用即可，其余逻辑（McNemar、配对 A/B、抗 p-hacking 门）都是平台无关的统计。

---

## 方案

### 方案 A：插件化打包（含技能移植）

将 39 个技能适配为 Hermes 插件 `~/.hermes/plugins/cc-thinking-skills/`。

**技能适配：**
- YAML frontmatter：添加 `metadata.hermes.tags`、`metadata.hermes.related_skills`
- 去掉 Claude Code 专用触发短语和工具调用模式
- 技能核心概念内容无需改动（平台无关）

**插件层：**

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
- 可通过 `metadata.hermes` 扩展字段支持 Hermes 特有功能
- 技能文件最大程度保持原样

**代价：** 中。技能 frontmatter 适配 ~2-3h + 插件代码 ~200-300 行 Python。

---

### 方案 B：MCP 桥接

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

### 方案 C：评估框架移植（eval harness）

将 eval harness 移植到 Python，调用 Hermes API，与方案 A 组合使用。

| 组件 | Claude Code 现状 | Hermes 等价物 |
|------|------|------|
| `droid.js` (模型调用) | `claude` CLI | Hermes API 直调 |
| `run-structural.js` (Tier 0) | Node.js 脚本 | Python `scripts/validate_skills.py` |
| `run-routing.js` (Tier 2) | droid + judge panel | `delegate_task` 子 agent |
| `run-behavioral.js` (Tier 3) | paired A/B | 同上 + `scipy.stats` 替代 stats.js |
| `stats.js` (统计) | JS 手写实现 | `scipy.stats.mcnemar` 等 |

**优势：** 保留评估严谨性（McNemar 检验、抗 p-hacking 门、复制验证）。与方案 A 完全解耦——eval harness 直接读技能文件不依赖插件机制。

**代价：** 中高。droid.js 是整个项目的最高桥接度 god node——替换它涉及重写 15+ 个 eval runner 的模型调用路径。但 Hermes API 比 CLI 调用更简洁，实际工作量可压缩到 3-5 天。

---

## 建议执行路径

```
现在 ──────────────────────────────────────────────────► 未来

  │ 方案 B               │ 方案 A                  │ 方案 A + C
  │ MCP 桥接             │ 技能移植 + 插件化        │ 插件 + eval harness
  │ (零成本, 立即可用)    │ (2-3h + 半天)           │ (+3-5 天)
  │                      │                         │
  ▼                      ▼                         ▼
 Hermes 能查            技能成为 Hermes             可量化评估
 询技能图谱             原生能力                    技能质量
```

1. **立即：方案 B** — graphify MCP 桥接，零成本让 Hermes 能查询技能图谱
2. **短期：方案 A** — 技能文件适配 + 插件化动态加载，技能成为 Hermes 原生能力
3. **中期：方案 A + C** — 在插件基础上叠加 eval harness，恢复可量化评估能力。C 只依赖技能文件本身，与 A 的插件机制无耦合

---

## 相关资源

- [graphify-out/GRAPH_REPORT.md](../graphify-out/GRAPH_REPORT.md) — 知识图谱审计报告
- [graphify-out/graph.json](../graphify-out/graph.json) — 原始图谱数据
- [analysis/ELEVATE-OR-KILL-SCORECARD.md](ELEVATE-OR-KILL-SCORECARD.md) — 技能评分卡（规范真相源）
- [analysis/EVALUATION.md](EVALUATION.md) — 4 层评估框架设计文档
- Hermes Agent 仓库：`E:\GitHub\hermes-agent`
