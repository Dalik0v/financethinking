using AIProject.Services.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace AIProject.Controllers;

[ApiController]
[Route("api/ai")]
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


