using Microsoft.Extensions.Configuration;

namespace AIProject.Services;

public class AIService
{
    private readonly IConfiguration _configuration;

    public AIService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<string> Ask(string prompt)
    {
        // Placeholder implementation.
        // Replace with actual OpenAI call.
        return Task.FromResult($"(stub) Received prompt: {prompt}");
    }
}

