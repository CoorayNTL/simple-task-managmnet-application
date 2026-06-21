import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Task, TaskFilter, TaskPriority } from '../../../shared/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() refreshTrigger = 0;
  @Output() editTask = new EventEmitter<Task>();
  @Output() newTask = new EventEmitter<void>();

  tasks: Task[] = [];
  loading = false;
  errorMessage = '';

  filter: TaskFilter = {
    isCompleted: null,
    priority: '',
    searchTerm: '',
    sortBy: 'createdAt',
    sortDescending: true
  };

  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  readonly sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' }
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.loadTasks();
    }
  }

  loadTasks(): void {
    this.loading = true;
    this.errorMessage = '';
    this.taskService.getAll(this.filter).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load tasks.';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadTasks();
  }

  onSortChange(sortBy: string): void {
    if (this.filter.sortBy === sortBy) {
      this.filter.sortDescending = !this.filter.sortDescending;
    } else {
      this.filter.sortBy = sortBy;
      this.filter.sortDescending = true;
    }
    this.loadTasks();
  }

  toggleComplete(task: Task): void {
    const updateReq = {
      title: task.title,
      description: task.description,
      isCompleted: !task.isCompleted,
      priority: task.priority,
      dueDate: task.dueDate
    };
    this.taskService.update(task.id, updateReq).subscribe({
      next: (updated) => {
        const idx = this.tasks.findIndex(t => t.id === task.id);
        if (idx >= 0) this.tasks[idx] = updated;
      },
      error: () => { this.errorMessage = 'Failed to update task.'; }
    });
  }

  onDelete(task: Task): void {
    if (!confirm(`Delete "${task.title}"?`)) return;
    this.taskService.delete(task.id).subscribe({
      next: () => { this.tasks = this.tasks.filter(t => t.id !== task.id); },
      error: () => { this.errorMessage = 'Failed to delete task.'; }
    });
  }

  onEdit(task: Task): void {
    this.editTask.emit(task);
  }

  onNew(): void {
    this.newTask.emit();
  }

  clearFilters(): void {
    this.filter = { isCompleted: null, priority: '', searchTerm: '', sortBy: 'createdAt', sortDescending: true };
    this.loadTasks();
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  trackById(_: number, task: Task): number {
    return task.id;
  }
}
