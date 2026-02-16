# Missing Tests Audit Prompt

Analyze for test coverage gaps:
- Functions with no tests
- Untested error paths
- Missing edge case tests
- Untested async operations
- No integration tests for critical paths

For each finding, provide:
1. Function/module name
2. File location
3. What's untested
4. Test scenario suggestion

Format as JSON array with objects containing: function, file, untested_scenarios, suggested_test.
