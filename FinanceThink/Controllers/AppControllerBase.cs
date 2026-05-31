using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceThink.Controllers;

public abstract class AppControllerBase : ControllerBase
{
    /// <summary>Returns the userId from JWT, or null if unauthenticated.</summary>
    protected string? GetUserId() =>
        User.FindFirstValue("sub")
        ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
}
