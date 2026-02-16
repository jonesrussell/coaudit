# Dead Code Audit Prompt

Analyze the provided codebase and identify:
- Unused functions or methods
- Unreachable code blocks
- Unused imports or dependencies
- Variables declared but never used

For each finding, provide:
1. File path and line number
2. The dead code snippet
3. Impact (can it be safely removed?)
4. Recommendation

Format as JSON array with objects containing: file, line, code, impact, recommendation.
