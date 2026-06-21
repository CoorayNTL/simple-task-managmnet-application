using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManagement.Api.DTOs;
using TaskManagement.Api.Entities;

namespace TaskManagement.Api.Interfaces
{
    public interface ITaskRepository : IRepository<TaskItem>
    {
        Task<IEnumerable<TaskItem>> GetFilteredAsync(TaskFilterDto filter);
    }
}
