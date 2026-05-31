using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceThink.Domain;

public sealed class Goal
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "numeric(18,2)")]
    public decimal TargetAmount { get; set; }

    [Column(TypeName = "numeric(18,2)")]
    public decimal SavedAmount { get; set; } = 0m;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    public DateTime? Deadline { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(200)]
    public string? UserId { get; set; }
}