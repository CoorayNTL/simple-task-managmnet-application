using System.Threading.Tasks;

namespace TaskManagement.Api.Services
{
    public interface IAuthService
    {
        Task<bool> ValidateAsync(string username, string password);
    }
}
