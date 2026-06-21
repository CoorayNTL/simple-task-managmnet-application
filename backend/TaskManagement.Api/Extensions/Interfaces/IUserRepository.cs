using System.Threading.Tasks;
using TaskManagement.Api.Entities;

namespace TaskManagement.Api.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
    }
}
