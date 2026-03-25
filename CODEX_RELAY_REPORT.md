# Codex Relay Report

Date: 2026-03-25
Project: `PG_DEV_GUIDE_VIEW`

## Summary

This report captures the Codex relay debugging work so Gemini can continue from the current state without re-investigating the same issue.

## What Was Observed

The original relay flow was:

- `scripts/relay.sh`
- `codex exec --sandbox workspace-write --skip-git-repo-check`

However, earlier `MISSION_REPORT.md` output from the paired workflow showed:

- `approval: never`
- `sandbox: read-only`

That made it look like Codex was ignoring the relay script's `workspace-write` option.

## What Was Verified

1. The active Codex workspace session is not read-only.
2. `codex.ps1` itself is not forcing `read-only`.
3. The existing Codex config did not explain the old `read-only` result.
4. Running Codex directly with the VS Code extension binary showed:
   - `sandbox: workspace-write`
   - so the relay option itself is valid
5. The direct run also exposed two separate blockers:
   - Codex runtime/state writes under the default home directory
   - network/socket failures to Codex endpoints

## Confirmed Error Signals

Observed during direct execution:

- `attempt to write a readonly database`
- websocket/connectivity failures such as:
  - `os error 10013`
  - `error sending request for url (https://chatgpt.com/backend-api/codex/responses)`

Git Bash was also unstable:

- `bash.exe: couldn't create signal pipe, Win32 error 5`

## Changes Applied

### 1. Hardened Bash Relay

Updated:

- `scripts/relay.sh`

Changes:

- resolve a concrete Codex executable instead of relying on bare `codex`
- log the resolved executable path
- set project-local runtime paths:
  - `.codex-runtime/home`
  - `.codex-runtime/tmp`
- force Codex to use those runtime directories

### 2. Added PowerShell Relay

Added:

- `scripts/relay.ps1`

Purpose:

- provide a non-Bash execution path
- avoid Git Bash startup failures
- avoid text corruption from default PowerShell file encoding behavior

Implementation details:

- all file reads/writes use explicit UTF-8 without BOM
- mission/report/log files are handled through .NET file APIs
- Codex input is passed through redirected process I/O

## Current Best Execution Path

Prefer PowerShell relay over Git Bash in the current environment.

Recommended command:

```powershell
powershell -ExecutionPolicy Bypass -File C:\test\PG_DEV_GUIDE_VIEW\scripts\relay.ps1
```

## Current Status

The strongest current explanation is:

- relay script syntax was not the main root cause
- `workspace-write` can be applied correctly
- Git Bash is unstable in this environment
- project-local runtime paths should reduce local write failures
- the main remaining blocker is network/security access to Codex services

## What Gemini Should Do Next

1. Use `scripts/relay.ps1` first, not `scripts/relay.sh`.
2. Check `conversation_log.md` for:
   - `Resolved Codex CLI: ...`
   - execution start/end timestamps
3. Check `MISSION_REPORT.md` for:
   - the sandbox line
   - any network or socket error messages
4. If execution still fails, treat the remaining issue as environment or policy related, not just a script bug.

## Files Changed By Codex During This Investigation

- `C:\test\PG_DEV_GUIDE_API\scripts\relay.sh`
- `C:\test\PG_DEV_GUIDE_API\scripts\relay.ps1`
- `C:\test\PG_DEV_GUIDE_VIEW\scripts\relay.sh`
- `C:\test\PG_DEV_GUIDE_VIEW\scripts\relay.ps1`

## Important Note

Existing project documents already show some encoding damage from earlier runs. This report is intended to be the clean handoff source for Gemini.
