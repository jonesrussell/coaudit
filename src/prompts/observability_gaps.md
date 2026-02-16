# Observability Gaps Audit Prompt

Analyze for missing observability:
- No logging at critical points
- Missing error context (stack traces, user info)
- No performance metrics
- Missing structured logging
- Unmonitored async operations
- Silent failures

For each finding, provide:
1. Location/function
2. Type of gap (logging, metrics, error handling)
3. Why it matters
4. Recommended instrumentation

Format as JSON array with objects containing: location, gap_type, impact, recommendation.
