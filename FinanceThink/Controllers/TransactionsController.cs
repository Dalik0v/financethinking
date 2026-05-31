using FinanceThink.Data;
using FinanceThink.Domain;
using FinanceThink.DTOs.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceThink.Controllers;

[Authorize]
[ApiController]
[Route("transactions")]
public sealed class TransactionsController : AppControllerBase
{
    private readonly ApplicationDbContext _db;

    public TransactionsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<object>> GetAllAsync([FromQuery] int? take, [FromQuery] int? page, CancellationToken ct)
    {
        var uid = GetUserId();
        var takeValue = Math.Clamp(take.GetValueOrDefault(20), 1, 200);
        var pageValue = Math.Max(page.GetValueOrDefault(1), 1);

        var query = _db.Transactions.AsNoTracking()
            .Where(x => x.UserId == uid)
            .OrderByDescending(x => x.Date);

        var totalCount = await query.CountAsync(ct);
        var items = await query
            .Skip((pageValue - 1) * takeValue)
            .Take(takeValue)
            .Select(x => new TransactionResponseDto
            {
                Id = x.Id, Amount = x.Amount, Type = x.Type,
                Category = x.Category, Description = x.Description,
                Date = x.Date, UserId = x.UserId
            })
            .ToListAsync(ct);

        var balance    = await CalcBalanceAsync(uid);
        var monthInc   = await CalcMonthlyAsync(uid, TransactionType.Income, DateTime.UtcNow, ct);
        var monthExp   = await CalcMonthlyAsync(uid, TransactionType.Expense, DateTime.UtcNow, ct);

        return Ok(new { currentBalance = balance, monthlyIncome = monthInc, monthlyExpenses = monthExp, totalCount, recentTransactions = items });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransactionResponseDto>> GetByIdAsync(int id, CancellationToken ct)
    {
        var uid = GetUserId();
        var entity = await _db.Transactions.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == uid, ct);
        if (entity is null) return NotFound();
        return Ok(Map(entity));
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> CreateAsync([FromBody] CreateTransactionDto dto, CancellationToken ct)
    {
        if (dto is null) return BadRequest("Body is required.");
        if (dto.Date == default) return BadRequest("Date must be provided.");

        var uid = GetUserId();
        var entity = new Transaction
        {
            Amount = dto.Amount, Type = dto.Type, Category = dto.Category,
            Description = dto.Description, Date = dto.Date, UserId = uid
        };
        _db.Transactions.Add(entity);
        await _db.SaveChangesAsync(ct);
        return Ok(Map(entity));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        var uid = GetUserId();
        var entity = await _db.Transactions.FirstOrDefaultAsync(x => x.Id == id && x.UserId == uid, ct);
        if (entity is null) return NotFound();
        _db.Transactions.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    private static TransactionResponseDto Map(Transaction x) => new()
    {
        Id = x.Id, Amount = x.Amount, Type = x.Type,
        Category = x.Category, Description = x.Description,
        Date = x.Date, UserId = x.UserId
    };

    private async Task<decimal> CalcBalanceAsync(string? uid)
    {
        var inc = await _db.Transactions.AsNoTracking()
            .Where(x => x.UserId == uid && x.Type == TransactionType.Income)
            .SumAsync(x => (decimal?)x.Amount) ?? 0m;
        var exp = await _db.Transactions.AsNoTracking()
            .Where(x => x.UserId == uid && x.Type == TransactionType.Expense)
            .SumAsync(x => (decimal?)x.Amount) ?? 0m;
        return inc - exp;
    }

    private async Task<decimal> CalcMonthlyAsync(string? uid, TransactionType type, DateTime now, CancellationToken ct)
    {
        var start = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = start.AddMonths(1);
        return await _db.Transactions.AsNoTracking()
            .Where(x => x.UserId == uid && x.Type == type && x.Date >= start && x.Date < end)
            .SumAsync(x => (decimal?)x.Amount, ct) ?? 0m;
    }
}
