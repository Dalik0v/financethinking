namespace FinanceThink.Tests.Integration;

public class HttpClientFixture : IDisposable
{
    public HttpClient Client { get; }

    public HttpClientFixture()
    {
        var baseUrl = Environment.GetEnvironmentVariable("TESTQ_API_URL") ?? "http://localhost:5193";
        Client = new HttpClient { BaseAddress = new Uri(baseUrl) };
    }

    public void Dispose() => Client.Dispose();
}
