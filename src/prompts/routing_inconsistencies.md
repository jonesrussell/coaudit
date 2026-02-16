# Routing Inconsistencies Audit Prompt

Analyze routing for inconsistencies:
- Routes defined but no handler
- Handlers with no routes
- Inconsistent parameter naming
- Missing error handling for routes
- Mismatched HTTP methods

For each finding, provide:
1. Route path
2. Type of inconsistency
3. Files involved
4. Recommended fix

Format as JSON array with objects containing: route, inconsistency_type, files, recommendation.
