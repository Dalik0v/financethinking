using FinanceThink.Data;
using FinanceThink.Domain;
using FinanceThink.DTOs.Analytics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceThink.Controllers;

[Authorize]
[ApiController]
[Route("analytics")]
public sealed class AnalyticsController : AppControllerBase
{
    private readonly ApplicationDbContext _db;

    public AnalyticsController(ApplicationDbContext db)
    {
        _db = db;
    }

    // GET /analytics/balance-history
    [HttpGet("balance-history")]
    public async Task<ActionResult<List<AnalyticsPointDto>>> GetBalanceHistoryAsync(CancellationToken cancellationToken)
    {
        // sort by createdAt ASC -> in current domain it's Transaction.Date
        var uid = GetUserId();
        var ordered = await _db.Transactions
            .AsNoTracking()
            .Where(x => x.UserId == uid)
            .OrderBy(x => x.Date)
            .Select(x => new { x.Date, x.Amount, x.Type })
            .ToListAsync(cancellationToken);

        decimal runningBalance = 0m;

        // aggregate per day: last runningBalance within that day
        string? currentDay = null;
        DateTime? currentDayDate = null;
        decimal currentDayBalance = 0m;

        var points = new List<AnalyticsPointDto>(ordered.Count);

        foreach (var tx in ordered)
        {
            var day = tx.Date.ToString("yyyy-MM-dd");

            if (currentDay is null)
            {
                currentDay = day;
                currentDayDate = tx.Date.Date;
                currentDayBalance = runningBalance;
            }
            else if (!string.Equals(currentDay, day, StringComparison.Ordinal))
            {
                // push previous day point
                if (currentDayDate is not null)
                {
                    points.Add(new AnalyticsPointDto
                    {
                        Date = currentDay,
                        Balance = currentDayBalance,
                    });
                }

                currentDay = day;
                currentDayDate = tx.Date.Date;
                currentDayBalance = runningBalance;
            }

            if (tx.Type == TransactionType.Income)
                runningBalance += tx.Amount;
            else if (tx.Type == TransactionType.Expense)
                runningBalance -= tx.Amount;
            else
                continue; // ignore Transfer

            // update balance for current day after applying transaction
            currentDayBalance = runningBalance;
        }

        if (currentDay is not null && currentDayDate is not null)
        {
            points.Add(new AnalyticsPointDto
            {
                Date = currentDay,
                Balance = currentDayBalance,
            });
        }

        return Ok(points);
    }
}

