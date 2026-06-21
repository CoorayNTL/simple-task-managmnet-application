using System;
using System.Threading.Tasks;

namespace TaskManagement.Api.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        ITaskRepository Tasks { get; }
        IUserRepository Users { get; }
        Task<int> SaveChangesAsync();
    }
}
