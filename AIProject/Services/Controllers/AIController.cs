using AIProject.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIProject.Controllers;

[ApiController]
[Route("api/ai")]
public class AIController : ControllerBase
{
    private readonly AIService _aiService;

    public AIController(AIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost]
    public async Task<IActionResult> Ask([FromBody] string prompt)
    {
        var result = await _aiService.Ask(prompt);
        return Ok(result);
    }
}

