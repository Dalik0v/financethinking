# Transaction system integration TODO (AIProject)

## Step 1 — Repo inspection
- [x] Confirm existing AIProject structure (minimal controllers/services)
- [x] Confirm no current EF Core/DbContext exists

## Step 2 — Add EF Core + PostgreSQL packages
- [ ] Update AIProject.csproj with:
  - EntityFrameworkCore
  - EntityFrameworkCore.Design
  - Npgsql provider

## Step 3 — Add connection string
- [ ] Update AIProject/appsettings.json (and optionally Development) with ConnectionStrings:Postgres

## Step 4 — Create EF Core data layer
- [ ] Create `Data/ApplicationDbContext.cs`
- [ ] Create Domain `Transaction` entity + `TransactionType` enum (and optional UserId)

## Step 5 — DTOs
- [ ] Create `DTOs/Transactions/CreateTransactionDto.cs`
- [ ] Create `DTOs/Transactions/TransactionResponseDto.cs`

## Step 6 — Controller + business logic
- [ ] Create `Controllers/TransactionsController.cs`
- [ ] Endpoints:
  - GET /api/transactions
  - GET /api/transactions/{id}
  - POST /api/transactions
  - DELETE /api/transactions/{id}
- [ ] Add balance/income/expenses + recent transactions logic using EF queries
- [ ] Add validation + proper async/await

## Step 7 — DI wiring
- [ ] Update AIProject/Program.cs to register ApplicationDbContext with Npgsql

## Step 8 — Migrations-ready code
- [ ] Ensure context is set up so `dotnet ef migrations add ...` works
- [ ] (Optional) Add minimal CLI commands to generate migrations (no execution here)

## Step 9 — Build verification
- [ ] Run `dotnet build` for AIProject

