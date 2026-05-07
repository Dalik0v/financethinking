using AIProject.Services.Abstractions;
using AIProject.Services.Options;
using Microsoft.Extensions.Options;
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
                "OpenAI ApiKey is missing. Configure section 'OpenAI:ApiKey' in appsettings.json.");

        var model = options?.Value?.Model ?? "gpt-4.1-mini";

        _client = new ChatClient(model: model, apiKey: apiKey);
    }

    public async Task<string> AskAsync(string prompt, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(prompt))
            throw new ArgumentException("Prompt must not be empty.", nameof(prompt));

        // In OpenAI .NET SDK v2.10.0 this overload expects an IEnumerable<OpenAI.Chat.ChatMessage>.
        // We must build the messages in the exact shape supported by your installed SDK.
        // Current SDK overload expects IEnumerable<OpenAI.Chat.ChatMessage>.
        // ChatMessage creation must match the OpenAI 2.10.0 API; adjust once the correct constructor/factory is known.
        throw new NotSupportedException("ChatMessage creation for OpenAI 2.10.0 is not yet configured.");







        var text = response?.Value?.Content is { Count: > 0 }
            ? response.Value.Content[0].Text
            : null;

        if (string.IsNullOrWhiteSpace(text))
            throw new InvalidOperationException("OpenAI returned an empty response.");

        return text;
    }
}

