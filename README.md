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

## 🚀 Future Enhancements

### Phase 1: Core Improvements
- [ ] **Real Copilot CLI API Integration** – Programmatic API when available
  - Batch audit processing without manual intervention
  - Structured JSON output parsing from Copilot responses
  - Severity levels (critical/high/medium/low) with risk scoring
  - Response caching to avoid duplicate analyses

- [ ] **Configuration File Support** – Full `.copilot-audit.json` integration
  - Enable/disable specific audit dimensions
  - Custom file extensions per project type
  - Context size limits per dimension
  - Custom exclude patterns (.gitignore respect)

- [ ] **Enhanced Reporting**
  - HTML report viewer with interactive filtering
  - JSON export for machine processing
  - CSV export for spreadsheet analysis
  - Risk score calculation and trend analysis
  - Summary charts and visualizations

### Phase 2: Integration & Scale
- [ ] **GitHub Integration**
  - Direct GitHub repo auditing (no clone needed)
  - PR audit comments with findings
  - GitHub Actions workflow template
  - Auto-create issues from audit findings
  - Branch comparison audits

- [ ] **Performance Optimizations**
  - Parallel dimension audits (6x speedup potential)
  - Incremental audits (only changed files)
  - Intelligent file chunking for large repos
  - Caching system with invalidation
  - Progress indicators for long-running audits

- [ ] **Testing & Quality**
  - Comprehensive test suite (vitest/jest)
  - Integration tests on real open-source repos
  - Performance benchmarks
  - CI/CD pipeline with GitHub Actions

### Phase 3: Advanced Features
- [ ] **Smart Analysis**
  - Project type auto-detection (Node, Python, Java, Go, etc.)
  - Language-specific audit dimensions
  - Dependency graph analysis
  - Code complexity metrics
  - Security vulnerability scanning

- [ ] **Customization & Extensibility**
  - Custom audit dimension plugin system
  - Custom prompt templates per organization
  - Rule severity customization
  - Team/project-specific configurations
  - Audit history and trend tracking

- [ ] **Collaboration Features**
  - Team audit result sharing
  - Audit result comparison (before/after)
  - Collaborative audit insights dashboard
  - Audit history and timeline
  - Integration with code review tools

### Phase 4: Enterprise Features
- [ ] **Advanced Reporting**
  - Executive summary dashboard
  - Team analytics and trending
  - Audit score trends over time
  - Custom report templates
  - Scheduled automated audits

- [ ] **Integration Ecosystem**
  - Slack notifications
  - Webhook integrations
  - Jira issue creation
  - Azure DevOps integration
  - GitLab CI/CD support

- [ ] **Security & Compliance**
  - GDPR-compliant data handling
  - Secrets detection (prevent credential leaks)
  - Compliance rule sets (SOC2, HIPAA, etc.)
  - Audit log tracking
  - Role-based access control

### Community & Open Source
- [ ] **Community Contributions**
  - Contributing guidelines (CONTRIBUTING.md)
  - Issue templates (bugs, features, discussions)
  - Pull request template
  - Code of conduct
  - Community audit dimension library

- [ ] **Documentation Expansion**
  - Video tutorials
  - Blog posts on audit best practices
  - Integration guides
  - Best practices guide
  - Troubleshooting guide
  - API documentation (when real API available)

- [ ] **Package Distribution**
  - NPM package publishing
  - Homebrew formula
  - Docker image
  - GitHub releases with changelogs
  - Version management strategy

## How to Contribute

Interested in helping? Check out the [DEVELOPMENT.md](./DEVELOPMENT.md) guide for:
- Architecture overview
- How to add custom audit dimensions
- Extension points
- Testing strategy
- Performance considerations

## License

MIT
