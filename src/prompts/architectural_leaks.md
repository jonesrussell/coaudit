# Architectural Leaks Audit Prompt

Analyze the codebase for architectural violations:
- Dependencies crossing layer boundaries
- Cyclic dependencies
- Exports of internal implementation details
- Improper coupling between modules

For each finding, provide:
1. Module/file involved
2. Description of the leak
3. Impact on maintainability
4. Recommended fix

Format as JSON array with objects containing: module, description, impact, recommendation.
