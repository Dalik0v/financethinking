namespace AIProject.DTOs.Analytics;

public sealed class AnalyticsPointDto
{
    // Example: "2026-05-01"
    public string Date { get; set; } = string.Empty;

    // decimal -> JSON number (System.Text.Json serializes decimal as JSON number)
    public decimal Balance { get; set; }
}

