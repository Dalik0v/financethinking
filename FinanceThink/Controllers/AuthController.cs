using FinanceThink.Data;
using FinanceThink.Domain;
using FinanceThink.DTOs.Auth;
using FinanceThink.Services.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FinanceThink.Controllers;

[ApiController]
[Route("auth")]
public sealed class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _config;
    private readonly IEmailService _emailService;

    public AuthController(ApplicationDbContext db, IConfiguration config, IEmailService emailService)
    {
        _db = db;
        _config = config;
        _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest("All fields are required.");

        if (dto.Password.Length < 6)
            return BadRequest("Password must be at least 6 characters.");

        var exists = await _db.Users.AnyAsync(u => u.Email == dto.Email.ToLowerInvariant(), ct);
        if (exists) return Conflict("Email already registered.");

        var user = new User
        {
            Email = dto.Email.Trim().ToLowerInvariant(),
            FullName = dto.FullName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow,
        };

        _db.Users.Add(user);

        // Create a default card for the new user
        _db.Cards.Add(new PaymentCard
        {
            Balance = 0m,
            CardNumber = GenerateCardNumber(),
            Holder = user.FullName,
            IsPrimary = true,
            UserId = user.Id.ToString(),
        });

        await _db.SaveChangesAsync(ct);

        _ = _emailService.SendAsync(
            user.Email,
            "Welcome to Finance App!",
            $"Hi {user.FullName}!\n\n" +
            $"Welcome to Finance App. We are glad to have you on board.\n\n" +
            $"You can now track your expenses, set savings goals, and stay on top of your finances.\n\n" +
            $"Every Saturday we will send you a reminder to keep working toward your dreams.\n\n" +
            $"Good luck!\n\n" +
            $"— Your Finance App");

        return Ok(new AuthResponseDto
        {
            Token = GenerateToken(user),
            FullName = user.FullName,
            Email = user.Email,
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest("Email and password are required.");

        var user = await _db.Users.FirstOrDefaultAsync(
            u => u.Email == dto.Email.Trim().ToLowerInvariant(), ct);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password.");

        return Ok(new AuthResponseDto
        {
            Token = GenerateToken(user),
            FullName = user.FullName,
            Email = user.Email,
        });
    }

    [Authorize]
    [HttpPatch("password")]
    public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
            return BadRequest("Both current and new password are required.");

        if (dto.NewPassword.Length < 6)
            return BadRequest("New password must be at least 6 characters.");

        var sub = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (sub is null) return Unauthorized();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id.ToString() == sub, ct);
        if (user is null) return Unauthorized();

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return BadRequest("Current password is incorrect.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _db.SaveChangesAsync(ct);
        return Ok();
    }

    private static string GenerateCardNumber()
    {
        var rng = Random.Shared;
        return $"{rng.Next(1000, 9999)} {rng.Next(1000, 9999)} {rng.Next(1000, 9999)} {rng.Next(1000, 9999)}";
    }

    private string GenerateToken(User user)
    {
        var secret = _config["Jwt:Secret"] ?? "changeme-very-long-secret-key-32chars!!";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("fullName", user.FullName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: "aifinance",
            audience: "aifinance",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
