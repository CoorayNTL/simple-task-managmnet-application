namespace TaskManagement.Api.Entities
{
    public enum TaskPriority { Low, Medium, High }

    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public System.DateTime? DueDate { get; set; }
        public System.DateTime CreatedAt { get; set; } = System.DateTime.UtcNow;
        public System.DateTime UpdatedAt { get; set; } = System.DateTime.UtcNow;
    }
}
