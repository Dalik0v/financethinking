using AIProject.Services.Abstractions;
using AIProject.Services.Options;
using AIProject.Services;
using AIProject.Data;
using AIProject.Domain;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<OpenAIOptions>(builder.Configuration.GetSection("OpenAI"));
builder.Services.AddScoped<IAIService, AIService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://danilanet.id.lv"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var connectionString = builder.Configuration.GetConnectionString("Postgres");
if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("ConnectionStrings:Postgres is missing.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors("AllowFrontend");

app.UseSwagger(c =>
{
    c.RouteTemplate = "swagger/{documentName}/swagger.json";
});

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AIProject API V1");
    c.RoutePrefix = "swagger";
});

app.MapControllers();

// Goals endpoints
app.MapGet("/goals", async (ApplicationDbContext db) =>
{
    var goals = await db.Goals.AsNoTracking()
        .OrderByDescending(g => g.CreatedAt)
        .Select(g => new {
            g.Id, g.Name, g.TargetAmount, g.SavedAmount,
            g.Category, g.Deadline, g.CreatedAt,
            ProgressPercent = g.TargetAmount > 0 ? Math.Round(g.SavedAmount / g.TargetAmount * 100, 1) : 0m
        })
        .ToListAsync();
    return Results.Ok(goals);
});

app.MapPost("/goals", async (ApplicationDbContext db, GoalCreateRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Name)) return Results.BadRequest("Name required.");
    if (req.TargetAmount <= 0) return Results.BadRequest("TargetAmount must be > 0.");
    var goal = new Goal {
        Name = req.Name.Trim(),
        TargetAmount = req.TargetAmount,
        Category = req.Category?.Trim() ?? "Other",
        Deadline = req.Deadline,
        CreatedAt = DateTime.UtcNow,
    };
    db.Goals.Add(goal);
    await db.SaveChangesAsync();
    return Results.Ok(new {
        goal.Id, goal.Name, goal.TargetAmount, goal.SavedAmount,
        goal.Category, goal.Deadline, goal.CreatedAt,
        ProgressPercent = 0m
    });
});

app.MapPatch("/goals/{id:guid}/deposit", async (ApplicationDbContext db, Guid id, DepositRequest req) =>
{
    if (req.Amount <= 0) return Results.BadRequest("Amount must be > 0.");
    var goal = await db.Goals.FirstOrDefaultAsync(g => g.Id == id);
    if (goal is null) return Results.NotFound();
    goal.SavedAmount = Math.Min(goal.TargetAmount, goal.SavedAmount + req.Amount);
    await db.SaveChangesAsync();
    return Results.Ok(new {
        goal.Id, goal.Name, goal.TargetAmount, goal.SavedAmount,
        goal.Category, goal.Deadline, goal.CreatedAt,
        ProgressPercent = goal.TargetAmount > 0 ? Math.Round(goal.SavedAmount / goal.TargetAmount * 100, 1) : 0m
    });
});

app.MapDelete("/goals/{id:guid}", async (ApplicationDbContext db, Guid id) =>
{
    var goal = await db.Goals.FirstOrDefaultAsync(g => g.Id == id);
    if (goal is null) return Results.NotFound();
    db.Goals.Remove(goal);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

record GoalCreateRequest(string Name, decimal TargetAmount, string? Category, DateTime? Deadline);
record DepositRequest(decimal Amount);