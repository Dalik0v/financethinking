using AIProject.Domain;
using System.ComponentModel.DataAnnotations;

namespace AIProject.DTOs.Transactions;

public sealed class CreateTransactionDto
{
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public TransactionType Type { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Category { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public DateTime Date { get; set; }
}

