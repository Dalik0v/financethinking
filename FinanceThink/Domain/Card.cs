using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceThink.Domain;

public sealed class PaymentCard
{
    public int Id { get; set; }

    [Column(TypeName = "numeric(18,2)")]
    public decimal Balance { get; set; }

    // Store as string to preserve formatting/leading zeros if needed.
    [MaxLength(32)]
    public string CardNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Holder { get; set; } = string.Empty;

    public bool IsPrimary { get; set; }

    // Optional for future auth.
    public string? UserId { get; set; }
}

