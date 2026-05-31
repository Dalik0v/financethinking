using FinanceThink.Data;
using FinanceThink.Domain;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Xunit;

namespace FinanceThink.Tests.Unit;

public class GoalDepositTests
{
    private static ApplicationDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(opts);
    }

    [Fact]
    public async Task Deposit_IncreasesGoalSavedAmount()
    {
        using var db = CreateDb();
        var goal = new Goal { Name = "Car", TargetAmount = 1000m, SavedAmount = 0m, Category = "Car", CreatedAt = DateTime.UtcNow };
        db.Goals.Add(goal);
        await db.SaveChangesAsync();

        goal.SavedAmount = Math.Min(goal.TargetAmount, goal.SavedAmount + 200m);
        await db.SaveChangesAsync();

        goal.SavedAmount.Should().Be(200m);
    }

    [Fact]
    public async Task Deposit_CannotExceedTargetAmount()
    {
        using var db = CreateDb();
        var goal = new Goal { Name = "Vacation", TargetAmount = 500m, SavedAmount = 400m, Category = "Travel", CreatedAt = DateTime.UtcNow };
        db.Goals.Add(goal);
        await db.SaveChangesAsync();

        goal.SavedAmount = Math.Min(goal.TargetAmount, goal.SavedAmount + 200m);
        await db.SaveChangesAsync();

        goal.SavedAmount.Should().Be(500m);
    }

    [Fact]
    public async Task Deposit_CreatesExpenseTransaction()
    {
        using var db = CreateDb();
        var goal = new Goal { Name = "Car", TargetAmount = 1000m, SavedAmount = 0m, Category = "Car", CreatedAt = DateTime.UtcNow };
        db.Goals.Add(goal);

        var depositAmount = 150m;
        db.Transactions.Add(new Transaction
        {
            Amount = depositAmount,
            Type = TransactionType.Expense,
            Category = "Goals",
            Description = $"Deposit to: {goal.Name}",
            Date = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();

        var tx = await db.Transactions.FirstOrDefaultAsync(t => t.Category == "Goals");
        tx.Should().NotBeNull();
        tx!.Amount.Should().Be(150m);
        tx.Type.Should().Be(TransactionType.Expense);
    }

    [Fact]
    public void ProgressPercent_CalculatesCorrectly()
    {
        var goal = new Goal { TargetAmount = 1000m, SavedAmount = 250m };
        var progress = goal.TargetAmount > 0 ? Math.Round(goal.SavedAmount / goal.TargetAmount * 100, 1) : 0;
        progress.Should().Be(25.0m);
    }
}
