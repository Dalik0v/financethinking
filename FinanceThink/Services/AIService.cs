using FinanceThink.Data;
using FinanceThink.Domain;
using FinanceThink.Services.Abstractions;
using FinanceThink.Services.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;

namespace FinanceThink.Services;

public sealed class AIService : IAIService
{
    private readonly ChatClient _client;
    private readonly ApplicationDbContext _db;

    public AIService(IOptions<OpenAIOptions> options, ApplicationDbContext db)
    {
        _db = db;

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

        // Load last 20 transactions from DB 
        var transactions = await _db.Transactions
            .OrderByDescending(t => t.Date)
            .Take(20)
            .ToListAsync(cancellationToken);

        var context = BuildTransactionContext(transactions);

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                "You are a concise AI financial advisor. " +
                "You have access to the user's recent transactions listed below. " +
                "Use this data to give specific, accurate answers about their spending, income, and balance. " +
                "Keep answers brief and practical. " +
                "If the user asks about their spending or finances, refer to the actual transaction data provided.\n\n" +
                context),
            new UserChatMessage(prompt.Trim())
        };

        var completion = await _client.CompleteChatAsync(messages, cancellationToken: cancellationToken);

        var text = completion.Value.Content[0].Text;
        return string.IsNullOrWhiteSpace(text) ? string.Empty : text.Trim();
    }

    private static string BuildTransactionContext(List<Transaction> transactions)
    {
        if (transactions.Count == 0)
            return "The user has no transactions yet.";

        var totalIncome = transactions
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.Amount);

        var totalExpenses = transactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);

        var lines = transactions.Select(t =>
            $"- [{t.Date:yyyy-MM-dd}] {t.Type}: {t.Description ?? t.Category} " +
            $"({t.Category}) ${t.Amount:F2}");

        return $"""
            USER TRANSACTION DATA (last {transactions.Count} transactions):
            Total Income: ${totalIncome:F2}
            Total Expenses: ${totalExpenses:F2}
            Net: ${totalIncome - totalExpenses:F2}

            Transactions:
            {string.Join("\n", lines)}
            """;
    }
}