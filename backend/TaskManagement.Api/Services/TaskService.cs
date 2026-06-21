using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskManagement.Api.DTOs;
using TaskManagement.Api.Entities;
using TaskManagement.Api.Interfaces;

namespace TaskManagement.Api.Services
{
    public class TaskService : ITaskService
    {
        private readonly IUnitOfWork _uow;

        public TaskService(IUnitOfWork uow) => _uow = uow;

        public async Task<IEnumerable<TaskItemDto>> GetAllAsync(TaskFilterDto filter)
        {
            var tasks = await _uow.Tasks.GetFilteredAsync(filter);
            return tasks.Select(MapToDto);
        }

        public async Task<TaskItemDto?> GetByIdAsync(int id)
        {
            var task = await _uow.Tasks.GetByIdAsync(id);
            return task is null ? (TaskItemDto?)null : MapToDto(task);
        }

        public async Task<TaskItemDto> CreateAsync(CreateTaskDto dto)
        {
            if (!Enum.TryParse<TaskPriority>(dto.Priority, true, out var priority))
                priority = TaskPriority.Medium;

            var task = new TaskItem
            {
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim(),
                Priority = priority,
                DueDate = dto.DueDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _uow.Tasks.AddAsync(task);
            await _uow.SaveChangesAsync();
            return MapToDto(task);
        }

        public async Task<TaskItemDto?> UpdateAsync(int id, UpdateTaskDto dto)
        {
            var task = await _uow.Tasks.GetByIdAsync(id);
            if (task is null) return null;

            if (!Enum.TryParse<TaskPriority>(dto.Priority, true, out var priority))
                priority = TaskPriority.Medium;

            task.Title = dto.Title.Trim();
            task.Description = dto.Description?.Trim();
            task.IsCompleted = dto.IsCompleted;
            task.Priority = priority;
            task.DueDate = dto.DueDate;
            task.UpdatedAt = DateTime.UtcNow;

            _uow.Tasks.Update(task);
            await _uow.SaveChangesAsync();
            return MapToDto(task);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var task = await _uow.Tasks.GetByIdAsync(id);
            if (task is null) return false;

            _uow.Tasks.Remove(task);
            await _uow.SaveChangesAsync();
            return true;
        }

        private static TaskItemDto MapToDto(TaskItem t) => new TaskItemDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            IsCompleted = t.IsCompleted,
            Priority = t.Priority.ToString(),
            DueDate = t.DueDate,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt
        };
    }
}
