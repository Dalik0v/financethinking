namespace AIProject.DTOs.Cards;

public sealed class CardResponseDto
{
    public decimal Balance { get; set; }
    public string CardNumber { get; set; } = string.Empty;
    public string Holder { get; set; } = string.Empty;
}

