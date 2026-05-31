namespace FinanceThink.Services.Options;

public sealed class OpenAIOptions
{
    public string ApiKey { get; set; } = string.Empty;
    public string? Model { get; set; } = "gpt-4.1-mini";
}

