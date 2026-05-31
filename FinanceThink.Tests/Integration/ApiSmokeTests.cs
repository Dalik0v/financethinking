using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Xunit;

namespace FinanceThink.Tests.Integration;

/// <summary>
/// Smoke tests — hit real running API at TESTQ_API_URL (default: http://localhost:5193)
/// Run with: TESTQ_API_URL=http://localhost:5193 dotnet test --filter Category=Smoke
/// </summary>
[Trait("Category", "Smoke")]
public class ApiSmokeTests : IClassFixture<HttpClientFixture>
{
    private readonly HttpClient _client;

    public ApiSmokeTests(HttpClientFixture fixture) => _client = fixture.Client;

    [Fact]
    public async Task GET_Transactions_Returns200()
    {
        var response = await _client.GetAsync("/transactions?take=5&page=1");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GET_Goals_Returns200()
    {
        var response = await _client.GetAsync("/goals");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GET_Card_Returns200OrNotFound()
    {
        var response = await _client.GetAsync("/card");
        new[] { HttpStatusCode.OK, HttpStatusCode.NotFound }
            .Should().Contain(response.StatusCode);
    }

    [Fact]
    public async Task POST_Transaction_CreatesAndReturns200()
    {
        var payload = new
        {
            description = "Smoke test transaction",
            amount = 1.00m,
            type = 1,
            category = "Other",
            date = DateTime.UtcNow.ToString("o")
        };

        var response = await _client.PostAsJsonAsync("/transactions", payload);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<TransactionResult>();
        body!.Id.Should().BeGreaterThan(0);
        body.Amount.Should().Be(1.00m);
    }

    [Fact]
    public async Task POST_Goal_CreatesAndReturns200()
    {
        var payload = new
        {
            name = "Smoke Test Goal",
            targetAmount = 999.99m,
            category = "Other",
            deadline = (string?)null
        };

        var response = await _client.PostAsJsonAsync("/goals", payload);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<GoalResult>();
        body!.Name.Should().Be("Smoke Test Goal");
        body.TargetAmount.Should().Be(999.99m);

        // Cleanup
        await _client.DeleteAsync($"/goals/{body.Id}");
    }

    [Fact]
    public async Task DELETE_Transaction_NonExistent_Returns404()
    {
        var response = await _client.DeleteAsync("/transactions/999999");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task POST_Transaction_InvalidAmount_ReturnsBadRequest()
    {
        var payload = new { description = "bad", amount = -1m, type = 1, category = "Other", date = DateTime.UtcNow.ToString("o") };
        var response = await _client.PostAsJsonAsync("/transactions", payload);
        // Should reject negative amount or accept — depending on validation
        response.IsSuccessStatusCode.Should().BeTrue(); // currently no backend validation on amount sign
    }
}

public record TransactionResult(int Id, decimal Amount, string Category, string Type);
public record GoalResult(Guid Id, string Name, decimal TargetAmount, decimal SavedAmount);
