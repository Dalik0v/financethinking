# AIProject - OpenAI integration TODO

## Step 1 — Confirm current project wiring
- [x] Inspect current `AIService.cs`, `AIController.cs`, `Program.cs`
- [x] Inspect `appsettings.json` locations (root + Services/)

## Step 2 — Clean architecture + Options
- [x] Create `OpenAIOptions` bound to `OpenAI` section
- [ ] Refactor `AIService.cs` into production-ready implementation:

  - [ ] Define `IAIService`
  - [ ] Implement `OpenAiChatService` using official OpenAI SDK (gpt-4.1-mini)
  - [ ] Async/await, input validation
  - [ ] Robust error handling + meaningful exceptions

## Step 3 — Program.cs DI wiring
- [ ] Update root `AIProject/Program.cs` to:
  - [ ] `Configure<OpenAIOptions>`
  - [ ] register `IAIService` implementation

## Step 4 — appsettings.json example
- [ ] Provide correct `AIProject/appsettings.json` example (API key under `OpenAI:ApiKey`)

## Step 5 — Verify Swagger testing
- [ ] Confirm request format for `POST /api/ai` (body = raw string)
- [ ] Explain manual testing in Swagger UI

## Step 6 — Document typical errors
- [ ] 401/403, 429, timeouts, empty responses, missing config

