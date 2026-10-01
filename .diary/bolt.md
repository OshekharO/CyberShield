## 2025-02-18 - Password Sanitization and JWT HTTP Status Handling

**Learning:** Indiscriminate recursive input sanitization on `req.body` strips special characters like `<`, `>`, `'`, and `;` from passwords before hashing or comparison, causing silent password corruption. Additionally, uncaught errors from `jwt.verify()` (such as `TokenExpiredError`) do not carry a default HTTP `status` property, causing generic error handlers to return 500 Internal Server Error instead of 401 Unauthorized.

**Action:** Preserved password fields in input sanitization routines and explicitly caught JWT verification exceptions in authentication guards to return 401 status.

## 2025-02-18 - Signal Property Naming Divergence in Report Export

**Learning:** Database JSON fields stored by scan services may use `snake_case` keys (e.g. `breach_count`, `blacklist_hits`), whereas PDF export routines expected `camelCase` keys (`breachCount`, `blacklistHits`), leading to default zero values in exported reports.

**Action:** Standardized signal extraction to check both `snake_case` and `camelCase` fallback fields in report generation.
