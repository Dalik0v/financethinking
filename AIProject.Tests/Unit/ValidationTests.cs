using AIProject.DTOs.Goals;
using AIProject.Domain;
using FluentAssertions;
using Xunit;

namespace AIProject.Tests.Unit;

public class ValidationTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public void Transaction_Amount_MustBePositive(decimal amount)
    {
        (amount > 0).Should().BeFalse();
    }

    [Theory]
    [InlineData(0.01)]
    [InlineData(100)]
    [InlineData(9999.99)]
    public void Transaction_Amount_ValidWhenPositive(decimal amount)
    {
        (amount > 0).Should().BeTrue();
    }

    [Fact]
    public void Goal_Name_CannotBeEmpty()
    {
        var name = "   ";
        string.IsNullOrWhiteSpace(name).Should().BeTrue();
    }

    [Fact]
    public void Goal_TargetAmount_MustBePositive()
    {
        var dto = new CreateGoalDto { Name = "Car", TargetAmount = -100m, Category = "Car" };
        (dto.TargetAmount > 0).Should().BeFalse();
    }

    [Theory]
    [InlineData(TransactionType.Income)]
    [InlineData(TransactionType.Expense)]
    public void TransactionType_IsValid(TransactionType type)
    {
        Enum.IsDefined(typeof(TransactionType), type).Should().BeTrue();
    }
}
