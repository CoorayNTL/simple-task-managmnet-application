using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Api.DTOs;
using TaskManagement.Api.Services;

namespace TaskManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService) => _authService = authService;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Username and password are required." });

            var valid = await _authService.ValidateAsync(dto.Username, dto.Password);
            if (!valid)
                return Unauthorized(new LoginResponseDto { Success = false, Message = "Invalid credentials." });

            return Ok(new LoginResponseDto { Success = true, Message = "Login successful.", Username = dto.Username });
        }
    }
}
