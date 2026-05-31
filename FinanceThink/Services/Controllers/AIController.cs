using FinanceThink.Services.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace FinanceThink.Controllers;

[ApiController]
[Route("ai")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost]
    public async Task<IActionResult> Ask([FromBody] string prompt, CancellationToken cancellationToken)
    {
        var result = await _aiService.AskAsync(prompt, cancellationToken);
        return Ok(result);
    }
}


