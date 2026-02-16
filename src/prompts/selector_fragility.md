# Selector Fragility Audit Prompt

Analyze for brittle CSS/DOM selectors:
- Overly specific selectors (coupling to HTML structure)
- Selectors relying on element order
- Inline style dependencies in selectors
- Selectors missing from updated HTML

For each finding, provide:
1. Selector and file location
2. Why it's fragile
3. Elements it targets
4. Recommended refactor (data-testid, semantic classes, etc.)

Format as JSON array with objects containing: selector, file, fragility_reason, recommendation.
