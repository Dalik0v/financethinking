using AIProject.Data;
using AIProject.Domain;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Xunit;

namespace AIProject.Tests.Unit;

public class TransactionBalanceTests
{
    private static ApplicationDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(opts);
    }

    [Fact]
    public async Task Balance_IsZero_WhenNoTransactions()
    {
        using var db = CreateDb();
        var income = await db.Transactions.Where(t => t.Type == TransactionType.Income).SumAsync(t => (decimal?)t.Amount) ?? 0m;
        var expense = await db.Transactions.Where(t => t.Type == TransactionType.Expense).SumAsync(t => (decimal?)t.Amount) ?? 0m;
        (income - expense).Should().Be(0m);
    }

    [Fact]
    public async Task Balance_CalculatesCorrectly()
    {
        using var db = CreateDb();
        db.Transactions.AddRange(
            new Transaction { Amount = 1000m, Type = TransactionType.Income, Category = "Salary", Date = DateTime.UtcNow },
            new Transaction { Amount = 200m, Type = TransactionType.Expense, Category = "Food", Date = DateTime.UtcNow },
            new Transaction { Amount = 300m, Type = TransactionType.Expense, Category = "Car", Date = DateTime.UtcNow }
        );
        await db.SaveChangesAsync();

        var income = await db.Transactions.Where(t => t.Type == TransactionType.Income).SumAsync(t => (decimal?)t.Amount) ?? 0m;
        var expense = await db.Transactions.Where(t => t.Type == TransactionType.Expense).SumAsync(t => (decimal?)t.Amount) ?? 0m;

        (income - expense).Should().Be(500m);
    }

    [Fact]
    public async Task Expense_Transaction_Reduces_Balance()
    {
        using var db = CreateDb();
        db.Transactions.Add(new Transaction { Amount = 500m, Type = TransactionType.Income, Category = "Salary", Date = DateTime.UtcNow });
        await db.SaveChangesAsync();

        db.Transactions.Add(new Transaction { Amount = 100m, Type = TransactionType.Expense, Category = "Food", Date = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var income = await db.Transactions.Where(t => t.Type == TransactionType.Income).SumAsync(t => (decimal?)t.Amount) ?? 0m;
        var expense = await db.Transactions.Where(t => t.Type == TransactionType.Expense).SumAsync(t => (decimal?)t.Amount) ?? 0m;

        (income - expense).Should().Be(400m);
    }
}
