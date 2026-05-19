using AIProject.Data;
using AIProject.DTOs.Cards;
using AIProject.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIProject.Controllers;

[ApiController]
[Route("card")]
public sealed class CardsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CardsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<CardResponseDto>> GetPrimaryAsync(CancellationToken cancellationToken)
    {
        var card = await _db.Cards
            .AsNoTracking()
            .Where(x => x.IsPrimary)
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync(cancellationToken);


        if (card is null)
            return NotFound("Primary card not found.");

        return Ok(new CardResponseDto
        {
            Balance = card.Balance,
            CardNumber = card.CardNumber,
            Holder = card.Holder
        });
    }
}

