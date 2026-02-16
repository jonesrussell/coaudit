# Copilot Instructions for coaudit

## Quick Start

**Run a single test** - Tests are planned but not yet implemented:
```bash
npm test
```

**Run the auditor:**
```bash
node src/runner.js          # Local directory
node bin/coaudit .          # Via CLI entrypoint
```

**Run audits on external repos:**
```bash
coaudit ~/my-project              # Local path
coaudit owner/repo                # GitHub shorthand
coaudit https://github.com/owner/repo  # Full GitHub URL
```

## Project Purpose

`coaudit` is a Copilot-powered code audit tool that analyzes codebases across six dimensions:
- Dead Code
- Architectural Leaks
- Selector Fragility
- Routing Inconsistencies
- Missing Tests
- Observability Gaps

Rather than implementing static analyzers, it orchestrates Copilot CLI to perform structured analysis using curated prompts.

## Architecture Overview

The audit flow:
1. **Input** → Accept GitHub URL or local path
2. **Preparation** → Clone GitHub repos to temp directory (if needed)
3. **Collection** → Scan target directory for source files (multi-language support)
4. **Prompting** → Load dimension-specific prompt from `src/prompts/{dimension}.md`
5. **Chunking** → Collect relevant files, limit context to 50KB per audit
6. **Analysis** → Call Copilot CLI with prompt + context in non-interactive mode (`-p` flag)
7. **Reporting** → Format Copilot's response as Markdown report

**Key entry points:**
- `src/runner.js` - Orchestrates all audits, runs real Copilot CLI via `execSync()`
- `src/report.js` - Generates Markdown reports from audit results
- `bin/coaudit` - CLI wrapper with argument parsing
- `bin/coaudit-interactive` - Interactive Copilot helper (shows available dimensions)

## Key Conventions

### Audit Dimensions
Each dimension has:
- A prompt template in `src/prompts/{dimension}.md`
- An entry in the `AUDIT_DIMENSIONS` array in `src/runner.js`
- Auto-discovery based on directory scanning

To add a new dimension:
1. Create `src/prompts/new_dimension.md` with analysis instructions
2. Add `"new_dimension"` to `AUDIT_DIMENSIONS` in `src/runner.js`
3. Re-run the auditor

### File Discovery
Currently scans: `src/`, `app/`, `routes/`, `resources/js/`, `lib/`, `components/`

Supports: `.js`, `.ts`, `.tsx`, `.jsx`, `.py`, `.php`, `.go`, `.java`, `.rs`

Auto-skips: `node_modules`, `dist`, `build`, `.git`, `.copilot`

See `collectContext()` in `src/runner.js` for implementation.

### Configuration
`.copilot-audit.json` controls:
- `audit.enabled` - Which dimensions to run
- `audit.contextLimit` - Max bytes per audit (50000 default)
- `copilot` settings - Model, temperature, timeouts
- `report` settings - Format, severity levels, output location

### Context Limiting
The `collectContext()` function concatenates files until reaching 50KB limit. This ensures Copilot can analyze context efficiently. Modify `contextLimit` in `.copilot-audit.json` to change behavior.

### Running Real Copilot
The `runCopilot()` function in `src/runner.js` executes:
```bash
copilot -p '<prompt + context>' --allow-all --add-dir '<target-directory>'
```

- `-p` flag enables non-interactive mode, ideal for batch audits
- `--allow-all` permits tool execution without prompts
- `--add-dir` grants Copilot access to the target repository
- Timeout: 3 minutes per dimension, with 10MB buffer for large responses

## Development Notes

### Testing Strategy
- No test framework yet (tests planned in Phase 1)
- Manual testing: `node bin/coaudit . ` (audit itself)
- Test on diverse projects: Node, Python, PHP, Go

### Performance
- Current audits on ~20 files are instant
- Large repos will benefit from parallel dimension audits (future)
- File discovery is sequential; could parallelize

### Common Tasks

**Debug audit on specific repo:**
```bash
node src/runner.js /path/to/repo
# Or with GitHub:
node src/runner.js owner/repo
```

**Run audit and save output:**
```bash
node src/runner.js /path/to/repo > audit-report.txt
```

**Audit with shorter timeout (for testing):**
Edit the `timeout` value in the `runCopilot()` function in `src/runner.js`

**Add a language:**
Add extension to `collectContext()` file scan and update prompts if needed.

**Modify audit prompt:**
Edit the `.md` file in `src/prompts/` directly. Prompts are loaded and sent to Copilot as-is.

**Change context limits:**
Edit `audit.contextLimit` in `.copilot-audit.json`

## Related Files

- **README.md** - High-level overview, quick start, roadmap
- **DEVELOPMENT.md** - Detailed architecture, next steps to V1, extension points
- **.copilot-audit.json** - Configuration (dimensions, limits, model settings)
- **src/copilot-integration.js** - Placeholder for real Copilot CLI API integration

## MCP Servers

### GitHub MCP Server
The GitHub MCP server is useful for this project since `coaudit` analyzes other repositories:

```bash
# Install in your Copilot CLI environment if not already available
# Then use it to:
# - Search for test examples in other projects
# - Check GitHub issues for audit-related discussions
# - Analyze real open-source projects alongside coaudit
```

**Common use cases in this repo:**
- Researching similar code audit tools (ESLint, SonarQube patterns)
- Finding test examples for implementing vitest/jest
- Discovering best practices for CLI tools and code analysis
- Analyzing real repositories to test coaudit against

## Integration Status

- ✅ Batch audit orchestration with real Copilot CLI
- ✅ GitHub repo cloning
- ✅ File context collection (multi-language)
- ✅ Markdown report generation
- ✅ Configuration framework
- ✅ All 6 audit dimensions fully functional
