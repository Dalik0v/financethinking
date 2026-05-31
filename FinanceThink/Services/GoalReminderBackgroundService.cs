using FinanceThink.Data;
using FinanceThink.Services.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace FinanceThink.Services;

public sealed class GoalReminderBackgroundService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<GoalReminderBackgroundService> _logger;

    public GoalReminderBackgroundService(IServiceProvider services, ILogger<GoalReminderBackgroundService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = TimeUntilNextSaturday();
            _logger.LogInformation("Next goal reminder in {Hours} hours", delay.TotalHours);
            await Task.Delay(delay, stoppingToken);

            await SendRemindersAsync(stoppingToken);
        }
    }

    private static TimeSpan TimeUntilNextSaturday()
    {
        var now = DateTime.UtcNow;
        var daysUntilSunday = ((int)DayOfWeek.Sunday - (int)now.DayOfWeek + 7) % 7;
        if (daysUntilSunday == 0 && (now.Hour > 15 || (now.Hour == 15 && now.Minute >= 25)))
            daysUntilSunday = 7;

        var nextSunday = now.Date.AddDays(daysUntilSunday).AddHours(15).AddMinutes(25);
        return nextSunday - now;
    }

    private async Task SendRemindersAsync(CancellationToken ct)
    {
        using var scope = _services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        var goals = await db.Goals
            .Where(g => g.Deadline != null)
            .ToListAsync(ct);

        var userIds = goals.Select(g => g.UserId).Distinct().ToList();
        var users = await db.Users
            .Where(u => userIds.Contains(u.Id.ToString()))
            .ToListAsync(ct);

        foreach (var user in users)
        {
            var userGoals = goals.Where(g => g.UserId == user.Id.ToString()).ToList();
            if (!userGoals.Any()) continue;

            var goalLines = string.Join("\n", userGoals.Select(g =>
                $"- {g.Name} — saved ${g.SavedAmount:F0} / ${g.TargetAmount:F0} · deadline {g.Deadline!.Value:MMM d, yyyy}"));

            var body =
                $"Hi {user.FullName}!\n\n" +
                $"Here is your weekly reminder to stay on track with your dreams. " +
                $"Consider setting aside $100 this week toward your goals.\n\n" +
                $"Your active goals:\n{goalLines}\n\n" +
                $"Every week counts. You got this.\n\n" +
                $"— Your Finance App";

            try
            {
                await emailService.SendAsync(user.Email, "Weekly Goal Reminder", body, ct);
                _logger.LogInformation("Reminder sent to {Email}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send reminder to {Email}", user.Email);
            }
        }
    }
}
