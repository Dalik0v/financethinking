using AIProject.Data;
using AIProject.Domain;
using AIProject.DTOs.Goals;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIProject.Controllers;

[Authorize]
[ApiController]
[Route("goals")]
public sealed class GoalsController : AppControllerBase
{
    private readonly ApplicationDbContext _db;

    public GoalsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<GoalResponseDto>>> GetAllAsync(CancellationToken ct)
    {
        var uid = GetUserId();
        var goals = await _db.Goals.AsNoTracking()
            .Where(g => g.UserId == uid)
            .OrderByDescending(g => g.CreatedAt)
            .Select(g => new GoalResponseDto
            {
                Id = g.Id, Name = g.Name, TargetAmount = g.TargetAmount,
                SavedAmount = g.SavedAmount, Category = g.Category,
                Deadline = g.Deadline, CreatedAt = g.CreatedAt,
            })
            .ToListAsync(ct);
        return Ok(goals);
    }

    [HttpPost]
    public async Task<ActionResult<GoalResponseDto>> CreateAsync([FromBody] CreateGoalDto dto, CancellationToken ct)
    {
        if (dto is null) return BadRequest("Body required.");
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name required.");
        if (dto.TargetAmount <= 0) return BadRequest("TargetAmount must be > 0.");

        var uid = GetUserId();
        var goal = new Goal
        {
            Name = dto.Name.Trim(), TargetAmount = dto.TargetAmount,
            Category = dto.Category.Trim(), Deadline = dto.Deadline,
            CreatedAt = DateTime.UtcNow, UserId = uid,
        };
        _db.Goals.Add(goal);
        await _db.SaveChangesAsync(ct);
        return Ok(ToDto(goal));
    }

    [HttpPatch("{id:guid}/deposit")]
    public async Task<ActionResult<GoalResponseDto>> DepositAsync(Guid id, [FromBody] DepositGoalDto dto, CancellationToken ct)
    {
        if (dto.Amount <= 0) return BadRequest("Amount must be > 0.");
        var uid = GetUserId();

        var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == uid, ct);
        if (goal is null) return NotFound();

        var actualDeposit = Math.Min(dto.Amount, goal.TargetAmount - goal.SavedAmount);
        goal.SavedAmount += actualDeposit;

        var card = await _db.Cards.Where(c => c.IsPrimary && c.UserId == uid).FirstOrDefaultAsync(ct);
        if (card is not null) card.Balance -= actualDeposit;

        _db.Transactions.Add(new Transaction
        {
            Amount = actualDeposit, Type = TransactionType.Expense,
            Category = "Goals", Description = $"Deposit to: {goal.Name}",
            Date = DateTime.UtcNow, UserId = uid,
        });

        await _db.SaveChangesAsync(ct);
        return Ok(ToDto(goal));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken ct)
    {
        var uid = GetUserId();
        var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == uid, ct);
        if (goal is null) return NotFound();
        _db.Goals.Remove(goal);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    private static GoalResponseDto ToDto(Goal g) => new()
    {
        Id = g.Id, Name = g.Name, TargetAmount = g.TargetAmount,
        SavedAmount = g.SavedAmount, Category = g.Category,
        Deadline = g.Deadline, CreatedAt = g.CreatedAt,
    };
}
