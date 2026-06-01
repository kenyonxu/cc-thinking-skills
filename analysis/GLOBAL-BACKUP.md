# Global Claude Backup

Created a local backup of global Claude assets before replacing the scientific-method skill.

## Archive

- `backups/claude-global-assets-20260601-0546.tgz`
- `backups/claude-global-assets-20260601-0546.manifest.txt`
- Archive size at creation: 144 MB
- Manifest entries: 19,136

## Included

- `~/.claude/skills/`
- `~/.claude/agents/`
- `~/.claude/plugins/`
- `~/.claude/settings.json`
- `~/.claude/settings.local.json`
- `~/.claude/remote-settings.json`

Claude hooks are configured through settings and plugin assets on this machine, so the settings files and plugin directories are included. No standalone `~/.claude/hooks/` or `~/.claude/subagents/` directory was present during backup.

## Excluded

- `~/.claude/.credentials.json`
- project conversation logs
- task runtime outputs

`backups/` is gitignored and should not be committed.

## Restore

Inspect before restoring:

```bash
tar -tzf backups/claude-global-assets-20260601-0546.tgz | less
```

Restore from the repository root only after confirming the target state:

```bash
tar -xzf backups/claude-global-assets-20260601-0546.tgz -C ~
```
