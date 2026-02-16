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
│   └── audit              # CLI entrypoint
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

```bash
# Install dependencies
npm install

# Run an audit on a target repository
npx audit /path/to/repo

# Example:
npx audit ~/my-project
```

## Architecture

The tool works in three phases:

1. **Collection** – Gather relevant files from the target codebase
2. **Prompting** – Load audit dimension prompts, chunk code context
3. **Copilot Integration** – Feed prompts + context to Copilot CLI
4. **Reporting** – Normalize results into a structured Markdown report

## Roadmap

### MVP ✓
- [x] CLI entrypoint (`bin/audit`)
- [x] Directory structure
- [x] Prompt templates (all 6 dimensions)
- [ ] Single Copilot CLI integration
- [ ] JSON → Markdown report

### V1
- [ ] Full Copilot CLI orchestration (all dimensions)
- [ ] Structured JSON output
- [ ] Pretty terminal output
- [ ] Example audits on open-source repos

### V2+
- [ ] GitHub integration (audit PRs directly)
- [ ] Caching & incremental audits
- [ ] Custom rule configuration
- [ ] Browser-based report viewer

## Development

```bash
# Run the auditor on a local project
node src/runner.js /path/to/repo

# Add a new audit dimension:
# 1. Create src/prompts/new_dimension.md
# 2. Add "new_dimension" to AUDIT_DIMENSIONS in src/runner.js
# 3. Re-run
```

## How Copilot CLI Powers This

This project showcases Copilot CLI's strength in agentic workflows:

- **Prompts as Code** – Audit rules live in markdown, easy to version & modify
- **Context Windows** – Feed relevant code chunks to Copilot for focused analysis
- **Structured Output** – Parse Copilot's JSON/markdown responses into reports
- **Composability** – Chain multiple audits without writing static analyzers

## License

MIT
