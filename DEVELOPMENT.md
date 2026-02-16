# Copilot Pipeline Auditor - Development Guide

## Current Status (MVP ✅)

The auditor is now **fully functional** with:

- ✅ 6 audit dimensions fully templated
- ✅ File context collection (multi-language support)
- ✅ Batch audit orchestration
- ✅ Structured Markdown report generation
- ✅ Interactive audit helper (`bin/audit-interactive`)
- ✅ Configuration framework (.copilot-audit.json)
- ✅ Integration framework (copilot-integration.js)

## Architecture Overview

```
User Command (bin/audit)
    ↓
runner.js (orchestration)
    ├→ Load prompt from src/prompts/*.md
    ├→ Collect context from target repo
    ├→ Call runCopilot() [currently mocked]
    ├→ Normalize output
    └→ Pass to report.js
        ↓
report.js (formatting)
    └→ Generate Markdown report
```

## Key Files

### Core
- `bin/audit` - Main CLI entrypoint (batch mode)
- `bin/audit-interactive` - Interactive Copilot helper
- `src/runner.js` - Audit orchestration
- `src/report.js` - Report generation
- `src/prompts/*.md` - Audit dimension instructions

### Integration Framework
- `src/copilot-integration.js` - Future Copilot CLI API integration
- `.copilot-audit.json` - User configuration

## How to Test

```bash
# Run batch audit on your project
node bin/audit ~/path/to/repo

# Run audit on this project (meta!)
node bin/audit .

# Show available interactive audits
node bin/audit-interactive /path/to/repo
```

## Next Steps to V1

### 1. Real Copilot CLI Integration
When Copilot CLI supports batch/programmatic mode:

```javascript
// Replace in src/runner.js
const output = await runCopilot(prompt, context, targetDir);

// With real call from src/copilot-integration.js
import { runCopilotReal, parseStructuredOutput } from './copilot-integration.js';
const output = await runCopilotReal(prompt, context);
const structured = parseStructuredOutput(output);
```

### 2. Structured Output Parsing
Currently returns raw text. Enhance normalize() to parse:

```javascript
function normalize(raw, dimensionName) {
  const structured = parseStructuredOutput(raw);
  return {
    status: 'completed',
    dimension: dimensionName,
    findings: structured.findings.map(f => ({
      file: f.file,
      line: f.line,
      severity: f.severity,
      description: f.description,
      suggestion: f.suggestion,
    })),
  };
}
```

### 3. Configuration Loading
Load from .copilot-audit.json:

```javascript
import config from '../.copilot-audit.json' assert { type: 'json' };

export async function runAudit(targetDir) {
  for (const dimension of config.audit.enabled) {
    // ...
  }
}
```

### 4. Severity Levels in Report
Enhance report.js with:

```javascript
const critical = findings.filter(f => f.severity === 'critical');
const high = findings.filter(f => f.severity === 'high');
// ... display with 🔴 🟠 🟡 🟢 icons
```

### 5. GitHub Integration
Add support for auditing GitHub repos directly:

```bash
node bin/audit github.com/owner/repo
```

## File Discovery Strategy

Current: Scans `src/`, `app/`, `routes/`, `resources/js/`, `lib/`, `components/`

Improvements:
- Auto-detect project type (Node, Python, Go, PHP, Java, Rust)
- Scan language-specific directories
- Respect .gitignore patterns
- Parallel file discovery for large repos
- Cache file lists between audits

## Context Chunking

Current: 50KB limit, single chunk per dimension

Improvements:
- Split large repos into semantic chunks
- Group by feature/module
- Prioritize relevant files per dimension
- Implement sliding window for overlap

## Output Formats

Current: Markdown report only

Future:
- JSON for machine parsing
- HTML for browser viewing
- CSV for spreadsheet import
- GitHub markdown with PR comments

## Testing

Add comprehensive tests:

```bash
npm install --save-dev vitest

# Test file collection
# Test context limiting
# Test report generation
# Test on real open-source projects
```

## Performance Considerations

Current audits on ~20 files are instant. For larger repos:

- Implement parallel dimension audits
- Add progress indicators
- Cache results between runs
- Add incremental audit mode (only changed files)

## Extending with Custom Dimensions

1. Create `src/prompts/custom_dimension.md`:
```markdown
# Custom Dimension Audit Prompt

Your audit instructions here.

Format output as JSON array with objects containing:
- field1
- field2
```

2. Add to `AUDIT_DIMENSIONS` in `src/runner.js`
3. Re-run auditor

## Security Considerations

- No credentials or secrets passed to Copilot
- All file access scoped to target directory
- Respectful rate limiting
- Option to exclude sensitive files

## Related Projects

- GitHub's Copilot CLI (what powers analysis)
- ESLint (static code analysis reference)
- SonarQube (audit reporting reference)
- DeepSource (automated code review reference)

---

**Ready to extend?** Pick a task from the next steps and dive in! 🚀
