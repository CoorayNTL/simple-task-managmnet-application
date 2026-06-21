import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Task, TaskPriority } from '../../../shared/models/task.model';
import { TaskService } from '../../../core/services/task.service';

interface TaskFormModel {
  title: string;
  description: string;
  isCompleted: boolean;
  priority: TaskPriority;
  dueDate: string;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnChanges {
  @Input() task: Task | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  model: TaskFormModel = this.emptyModel();
  saving = false;
  errorMessage = '';

  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  constructor(private taskService: TaskService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      if (this.task) {
        this.model = {
          title: this.task.title,
          description: this.task.description ?? '',
          isCompleted: this.task.isCompleted,
          priority: this.task.priority,
          dueDate: this.task.dueDate ? this.task.dueDate.substring(0, 10) : ''
        };
      } else {
        this.model = this.emptyModel();
      }
      this.errorMessage = '';
    }
  }

  get isEditing(): boolean {
    return this.task !== null;
  }

  onSubmit(): void {
    if (!this.model.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const payload = {
      title: this.model.title.trim(),
      description: this.model.description.trim() || undefined,
      isCompleted: this.model.isCompleted,
      priority: this.model.priority,
      dueDate: this.model.dueDate || undefined
    };

    const request$ = this.isEditing
      ? this.taskService.update(this.task!.id, payload)
      : this.taskService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.model = this.emptyModel();
        this.saved.emit();
      },
      error: () => {
        this.saving = false;
        this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'create'} task.`;
      }
    });
  }

  onCancel(): void {
    this.model = this.emptyModel();
    this.errorMessage = '';
    this.cancelled.emit();
  }

  private emptyModel(): TaskFormModel {
    return { title: '', description: '', isCompleted: false, priority: 'Medium', dueDate: '' };
  }
}
