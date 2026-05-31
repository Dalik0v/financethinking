using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceThink.Domain;

public enum TransactionType
{
    Income,
    Expense,
    Transfer
}


public sealed class Transaction
{
    public int Id { get; set; }

    [Column(TypeName = "numeric(18,2)")]
    public decimal Amount { get; set; }

    // Expense / TopUp
    public TransactionType Type { get; set; }

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime Date { get; set; }

    // Optional for future authentication.
    public string? UserId { get; set; }
}

