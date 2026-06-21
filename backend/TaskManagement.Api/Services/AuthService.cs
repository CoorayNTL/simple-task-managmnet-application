using System.Threading.Tasks;
using TaskManagement.Api.Interfaces;

namespace TaskManagement.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _uow;

        public AuthService(IUnitOfWork uow) => _uow = uow;

        public async Task<bool> ValidateAsync(string username, string password)
        {
            var user = await _uow.Users.GetByUsernameAsync(username);
            if (user is null) return false;
            return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        }
    }
}
