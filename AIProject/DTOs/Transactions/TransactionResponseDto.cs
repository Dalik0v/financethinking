using AIProject.Domain;

namespace AIProject.DTOs.Transactions;

public sealed class TransactionResponseDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    public string? UserId { get; set; }
}

