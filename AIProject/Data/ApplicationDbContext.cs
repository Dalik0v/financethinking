using AIProject.Domain;
using Microsoft.EntityFrameworkCore;

namespace AIProject.Data;


public sealed class ApplicationDbContext : DbContext
{
    private static string TransactionTypeToString(TransactionType value)
    {
        return value switch
        {
            TransactionType.Income => "Income",
            TransactionType.Expense => "Expense",
            TransactionType.Transfer => "Transfer",
            _ => value.ToString()
        };
    }

    private static TransactionType TransactionTypeFromString(string value)
    {
        var normalized = value?.Trim().ToLowerInvariant();

        return normalized switch
        {
            "income" => TransactionType.Income,
            "topup" => TransactionType.Income,
            "uncategorized income" => TransactionType.Income,
            "expense" => TransactionType.Expense,
            "transfer" => TransactionType.Transfer,
            _ => throw new InvalidOperationException($"Unknown TransactionType value from DB: '{value}'")
        };
    }



    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Transaction> Transactions => Set<Transaction>();

    public DbSet<PaymentCard> Cards => Set<PaymentCard>();



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("Transactions");


            entity.HasKey(e => e.Id);

            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Category).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Date).IsRequired();

            entity.Property(e => e.UserId)
                .HasMaxLength(200);

            // Store enum as string for better readability/migrations.
            // Backward compatibility:
            // - old DB values: "TopUp" (-> Income), "Income", "Expense"
            // - new canonical values: "Income", "Expense", "Transfer"
            entity.Property(e => e.Type)
                .HasConversion(
                    v => TransactionTypeToString(v),
                    v => TransactionTypeFromString(v))
                .HasMaxLength(20)
                .IsRequired();


        });

        modelBuilder.Entity<PaymentCard>(entity =>
        {
            entity.ToTable("Cards");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Balance).HasPrecision(18, 2);
            entity.Property(e => e.CardNumber).HasMaxLength(32).IsRequired();
            entity.Property(e => e.Holder).HasMaxLength(100).IsRequired();

            entity.Property(e => e.IsPrimary).IsRequired();

            entity.Property(e => e.UserId).HasMaxLength(200);

            // Helpful query index for primary card selection.
            entity.HasIndex(e => e.IsPrimary);
        });
    }
}


