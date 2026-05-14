using AIProject.Data;
using AIProject.Domain;
using AIProject.DTOs.Transactions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIProject.Controllers;

[ApiController]
[Route("api/transactions")]
public sealed class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public TransactionsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<object>> GetAllAsync([FromQuery] int? take, [FromQuery] int? page, CancellationToken cancellationToken)

    {
        var takeValue = take.GetValueOrDefault(20);
        if (takeValue <= 0 || takeValue > 200)
            return BadRequest("Parameter 'take' must be between 1 and 200.");

        var pageValue = page.GetValueOrDefault(1);
        if (pageValue <= 0)
            return BadRequest("Parameter 'page' must be >= 1.");

        var query = _db.Transactions.AsNoTracking().OrderByDescending(x => x.Date);

        var balance = await CalculateCurrentBalanceAsync();
        var monthlyIncome = await CalculateMonthlyIncomeAsync(DateTime.UtcNow);
        var monthlyExpenses = await CalculateMonthlyExpensesAsync(DateTime.UtcNow);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((pageValue - 1) * takeValue)
            .Take(takeValue)
            .Select(x => new TransactionResponseDto
            {
                Id = x.Id,
                Amount = x.Amount,
                Type = x.Type,
                Category = x.Category,
                Description = x.Description,
                Date = x.Date,
                UserId = x.UserId
            })
            .ToListAsync(cancellationToken);



        return Ok(new
        {
            currentBalance = balance,
            monthlyIncome,
            monthlyExpenses,
            totalCount,
            recentTransactions = items
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransactionResponseDto>> GetByIdAsync(int id)
    {
        var entity = await _db.Transactions.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity is null)
            return NotFound();

        return Ok(ToResponseExpression(entity));
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> CreateAsync([FromBody] CreateTransactionDto dto, CancellationToken cancellationToken)
    {
        if (dto is null)
            return BadRequest("Body is required.");

        if (dto.Date == default)
            return BadRequest("Date must be provided.");

        var entity = new Transaction
        {
            Amount = dto.Amount,
            Type = dto.Type,
            Category = dto.Category,
            Description = dto.Description,
            Date = dto.Date,
            // Optional for future auth.
            UserId = null
        };

        _db.Transactions.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetByIdAsync), new { id = entity.Id }, ToResponseExpression(entity));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _db.Transactions.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();

        _db.Transactions.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private static TransactionResponseDto ToResponseExpression(Transaction x) => new()
    {
        Id = x.Id,
        Amount = x.Amount,
        Type = x.Type,
        Category = x.Category,
        Description = x.Description,
        Date = x.Date,
        UserId = x.UserId
    };

    private async Task<decimal> CalculateCurrentBalanceAsync()
    {
        // current balance = TopUps - Expenses
        var topUps = await _db.Transactions.AsNoTracking()
            .Where(x => x.Type == TransactionType.TopUp)
            .SumAsync(x => (decimal?)x.Amount) ?? 0m;

        var expenses = await _db.Transactions.AsNoTracking()
            .Where(x => x.Type == TransactionType.Expense)
            .SumAsync(x => (decimal?)x.Amount) ?? 0m;

        return topUps - expenses;
    }

    private async Task<decimal> CalculateMonthlyIncomeAsync(DateTime dateUtc)
    {
        var monthStart = new DateTime(dateUtc.Year, dateUtc.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var monthEnd = monthStart.AddMonths(1);

        return (await _db.Transactions.AsNoTracking()
            .Where(x => x.Type == TransactionType.TopUp)
            .Where(x => x.Date >= monthStart && x.Date < monthEnd)
            .SumAsync(x => (decimal?)x.Amount)) ?? 0m;
    }

    private async Task<decimal> CalculateMonthlyExpensesAsync(DateTime dateUtc)
    {
        var monthStart = new DateTime(dateUtc.Year, dateUtc.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var monthEnd = monthStart.AddMonths(1);

        return (await _db.Transactions.AsNoTracking()
            .Where(x => x.Type == TransactionType.Expense)
            .Where(x => x.Date >= monthStart && x.Date < monthEnd)
            .SumAsync(x => (decimal?)x.Amount)) ?? 0m;
    }
}

