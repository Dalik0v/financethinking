using AIProject.Data;
using AIProject.DTOs.Cards;
using AIProject.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIProject.Controllers;

[Authorize]
[ApiController]
[Route("card")]
public sealed class CardsController : AppControllerBase
{
    private readonly ApplicationDbContext _db;

    public CardsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<CardResponseDto>> GetPrimaryAsync(CancellationToken ct)
    {
        var uid = GetUserId();
        var card = await _db.Cards.AsNoTracking()
            .Where(x => x.IsPrimary && x.UserId == uid)
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync(ct);

        if (card is null) return NotFound("Primary card not found.");
        return Ok(new CardResponseDto { Balance = card.Balance, CardNumber = card.CardNumber, Holder = card.Holder });
    }

    [HttpPatch("holder")]
    public async Task<IActionResult> UpdateHolderAsync([FromBody] UpdateHolderDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.Holder)) return BadRequest("Holder name cannot be empty.");
        var uid = GetUserId();
        var card = await _db.Cards
            .Where(x => x.IsPrimary && x.UserId == uid)
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync(ct);

        if (card is null) return NotFound("Primary card not found.");
        card.Holder = dto.Holder.Trim();
        await _db.SaveChangesAsync(ct);
        return Ok(new CardResponseDto { Balance = card.Balance, CardNumber = card.CardNumber, Holder = card.Holder });
    }
}
