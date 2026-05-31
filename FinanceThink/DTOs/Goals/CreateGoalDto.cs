namespace FinanceThink.DTOs.Goals;

public sealed class CreateGoalDto
{
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
}