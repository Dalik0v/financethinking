using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIProject.Domain;

public enum TransactionType
{
    Expense = 1,
    TopUp = 2
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

