namespace AIProject.Services.Abstractions;

public interface IAIService
{
    Task<string> AskAsync(string prompt, CancellationToken cancellationToken = default);
}

