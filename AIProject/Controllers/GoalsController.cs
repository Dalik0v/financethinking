using AIProject.Data;
using AIProject.Domain;
using AIProject.DTOs.Goals;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIProject.Controllers;

[ApiController]
[Route("goals")]
public sealed class GoalsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public GoalsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<GoalResponseDto>>> GetAllAsync(CancellationToken ct)
    {
        var goals = await _db.Goals
            .AsNoTracking()
            .OrderByDescending(g => g.CreatedAt)
            .Select(g => new GoalResponseDto
            {
                Id = g.Id,
                Name = g.Name,
                TargetAmount = g.TargetAmount,
                SavedAmount = g.SavedAmount,
                Category = g.Category,
                Deadline = g.Deadline,
                CreatedAt = g.CreatedAt,
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

        var goal = new Goal
        {
            Name = dto.Name.Trim(),
            TargetAmount = dto.TargetAmount,
            Category = dto.Category.Trim(),
            Deadline = dto.Deadline,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Goals.Add(goal);
        await _db.SaveChangesAsync(ct);

        return Ok(new GoalResponseDto
        {
            Id = goal.Id,
            Name = goal.Name,
            TargetAmount = goal.TargetAmount,
            SavedAmount = goal.SavedAmount,
            Category = goal.Category,
            Deadline = goal.Deadline,
            CreatedAt = goal.CreatedAt,
        });
    }

    [HttpPatch("{id:guid}/deposit")]
    public async Task<ActionResult<GoalResponseDto>> DepositAsync(Guid id, [FromBody] DepositGoalDto dto, CancellationToken ct)
    {
        if (dto.Amount <= 0) return BadRequest("Amount must be > 0.");

        var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id, ct);
        if (goal is null) return NotFound();

        goal.SavedAmount = Math.Min(goal.TargetAmount, goal.SavedAmount + dto.Amount);
        await _db.SaveChangesAsync(ct);

        return Ok(new GoalResponseDto
        {
            Id = goal.Id,
            Name = goal.Name,
            TargetAmount = goal.TargetAmount,
            SavedAmount = goal.SavedAmount,
            Category = goal.Category,
            Deadline = goal.Deadline,
            CreatedAt = goal.CreatedAt,
        });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken ct)
    {
        var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id, ct);
        if (goal is null) return NotFound();

        _db.Goals.Remove(goal);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}