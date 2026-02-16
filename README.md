# Copilot Pipeline Auditor

A CLI tool that performs intelligent, Copilot-assisted audits of any codebase.

## Overview

Instead of implementing static analysis directly, this tool orchestrates **Copilot CLI** to perform structured audits across six key dimensions:

- **Dead Code** – Unused functions, variables, imports
- **Architectural Leaks** – Layer violations, cyclic dependencies
- **Selector Fragility** – Brittle DOM/CSS selectors (for web projects)
- **Routing Inconsistencies** – Mismatched or missing route handlers
- **Missing Tests** – Coverage gaps and untested code paths
- **Observability Gaps** – Missing logging, metrics, error handling

Each audit dimension is powered by a curated prompt file that feeds context + codebase chunks into Copilot CLI.

## Project Structure

```
copilot-pipeline-auditor/
├── bin/
│   ├── audit              # Batch audit runner (generates report)
│   └── audit-interactive  # Interactive audit helper
├── src/
│   ├── prompts/           # Audit dimension prompts
│   │   ├── dead_code.md
│   │   ├── architectural_leaks.md
│   │   ├── selector_fragility.md
│   │   ├── routing_inconsistencies.md
│   │   ├── missing_tests.md
│   │   └── observability_gaps.md
│   ├── runner.js          # Orchestrates audits
│   └── report.js          # Generates audit reports
├── package.json
└── README.md
```

## Quick Start

### Run a Batch Audit (generates report)

```bash
# Install dependencies
npm install

# Run audit on any repository
npx audit /path/to/repo

# Example:
npx audit ~/my-project
```

This generates a Markdown report summarizing all six audit dimensions.

### Run an Interactive Audit (Copilot CLI)

For detailed analysis using Copilot CLI directly:

```bash
# Show available audit dimensions
npx audit-interactive /path/to/repo

# Run a specific audit dimension interactively
npx audit-interactive /path/to/repo dead_code
```

This launches Copilot CLI with pre-loaded audit prompts and code context, letting you:
- Ask follow-up questions
- Refine the analysis
- Get structured recommendations
- Save findings directly

## Architecture

The tool works in three phases:

1. **Collection** – Gather relevant files from the target codebase
2. **Prompting** – Load audit dimension prompts, chunk code context
3. **Reporting** – Generate structured Markdown audit report

For real-time analysis with Copilot CLI, the interactive mode feeds prompts + context directly.

## Audit Dimensions

Each audit dimension includes a prompt template that guides Copilot:

### Dead Code
- Unused functions, variables, imports
- Unreachable code blocks
- Recommended removals with impact assessment

### Architectural Leaks
- Layer boundary violations
- Cyclic dependencies
- Improper module coupling

### Selector Fragility
- Brittle CSS/DOM selectors
- Overly specific selectors
- Recommended refactors

### Routing Inconsistencies
- Routes without handlers
- Handlers without routes
- Parameter naming mismatches
- Missing error handling

### Missing Tests
- Untested functions
- Uncovered error paths
- Edge case gaps
- Integration test gaps

### Observability Gaps
- Missing logging
- No error context
- Unmonitored operations
- Silent failures

## Development

### Add a New Audit Dimension

1. Create `src/prompts/new_dimension.md` with audit instructions
2. Add `"new_dimension"` to `AUDIT_DIMENSIONS` in `src/runner.js`
3. Re-run the auditor

### Test the Auditor

```bash
# Run audit on the auditor itself (meta!)
node bin/audit .

# Run with a custom repository
node bin/audit ~/path/to/repo
```

## Example Output

```
# Copilot Pipeline Audit Report

**Repository:** ~/my-project
**Timestamp:** 2025-02-16T00:00:00.000Z

## Summary

| Status | Count |
|--------|-------|
| Completed | 6 |
| Skipped | 0 |
| Errors | 0 |

## Findings

### Dead Code
**Status:** ✅ Completed
...
```

## Roadmap

### V1 (Current)
- [x] CLI entrypoint with batch runner
- [x] All 6 audit dimension prompts
- [x] File context collection
- [x] Markdown report generation
- [x] Interactive helper script

### V2
- [ ] Real Copilot CLI integration (when API/SDK available)
- [ ] Structured JSON output parsing
- [ ] Severity levels and prioritization
- [ ] GitHub integration (audit PRs directly)

### V3+
- [ ] Caching & incremental audits
- [ ] Custom rule configuration
- [ ] Before/after comparison
- [ ] Browser-based report viewer
- [ ] Auto-fix suggestions

## How Copilot CLI Powers This

This project showcases Copilot CLI's strength in agentic workflows:

- **Prompts as Code** – Audit rules live in markdown, easy to version & modify
- **Context Windows** – Feed relevant code chunks to Copilot for focused analysis
- **Structured Output** – Parse Copilot's responses into reports
- **Composability** – Chain multiple audits without writing static analyzers
- **Extensibility** – Add new audit dimensions just by adding prompt files

## License

MIT
