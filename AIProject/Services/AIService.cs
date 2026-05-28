using AIProject.Services.Abstractions;
using AIProject.Services.Options;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;

namespace AIProject.Services;

/// <summary>
/// Clean architecture service implementation that calls the official OpenAI .NET SDK.
/// </summary>
public sealed class AIService : IAIService
{
    private readonly ChatClient _client;

    public AIService(IOptions<OpenAIOptions> options)
    {
        var apiKey = options?.Value?.ApiKey;
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException(
                "OpenAI API key is missing. Configure section 'OpenAI:ApiKey' in appsettings.json.");

        var model = options?.Value?.Model ?? "gpt-4.1-mini";

        _client = new OpenAIClient(apiKey).GetChatClient(model);
    }

    public async Task<string> AskAsync(string prompt, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(prompt))
            throw new ArgumentException("Prompt must not be empty.", nameof(prompt));

        // The controller posts the prompt as a raw string.
        // Build a minimal chat with system + user messages.
        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                "You are a concise AI financial advisor. " +
                "Help the user understand their transactions, budgets, and spending habits. " +
                "Keep answers brief and practical."),
            new UserChatMessage(prompt.Trim())
        };

        var completion = await _client.CompleteChatAsync(messages, cancellationToken: cancellationToken);

        var text = completion.Value.Content[0].Text;
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        return text.Trim();
    }
}




