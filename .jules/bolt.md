## 2026-09-09 - Non-blocking API Logging in Serverless Endpoints
**Learning:** Awaiting Prisma DB operations for telemetry/logging (such as `apiLog.create`) on the main execution path adds unnecessary database network roundtrip latency (~10–50ms) to every scan API request.
**Action:** Execute non-critical secondary operations like telemetry logging asynchronously without `await`, attaching a `.catch()` block to log errors without blocking or failing user-facing scan requests.
