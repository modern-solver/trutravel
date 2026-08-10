@echo off
REM Daily unattended run of the Migration Specialist agent, invoked by Windows Task Scheduler.
REM Logs are appended to .claude\migration-specialist.log (gitignored) for manual review.

cd /d "C:\Users\shaun\OA-AgenticHub"

"C:\Users\shaun\AppData\Roaming\npm\claude.cmd" -p "Run the migration-specialist handoff routine end to end: read docs/agents/migration-handoff.md, resync TruTravel-source/ against C:\Users\shaun\TruTravel, review for secrets, stage and commit (never push), update the handoff file (open flags + trimmed log), and report a summary with git log --oneline -5." ^
  --agent migration-specialist ^
  --permission-mode bypassPermissions ^
  --add-dir "C:\Users\shaun\TruTravel" ^
  --max-budget-usd 2 ^
  --no-session-persistence ^
  --output-format text ^
  >> "C:\Users\shaun\OA-AgenticHub\.claude\migration-specialist.log" 2>&1
