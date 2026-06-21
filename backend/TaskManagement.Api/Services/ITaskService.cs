using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManagement.Api.DTOs;

namespace TaskManagement.Api.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskItemDto>> GetAllAsync(TaskFilterDto filter);
        Task<TaskItemDto?> GetByIdAsync(int id);
        Task<TaskItemDto> CreateAsync(CreateTaskDto dto);
        Task<TaskItemDto?> UpdateAsync(int id, UpdateTaskDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
