namespace FinanceThink.DTOs.Goals;

public sealed class GoalResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal SavedAmount { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal ProgressPercent => TargetAmount > 0 ? Math.Round(SavedAmount / TargetAmount * 100, 1) : 0;
}