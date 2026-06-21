import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Task } from '../../../shared/models/task.model';

@Component({
  selector: 'app-task-layout',
  templateUrl: './task-layout.component.html',
  styleUrls: ['./task-layout.component.scss']
})
export class TaskLayoutComponent implements OnInit {
  selectedTask: Task | null = null;
  refreshTrigger = 0;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onEditTask(task: Task): void {
    this.selectedTask = task;
  }

  onNewTask(): void {
    this.selectedTask = null;
  }

  onTaskSaved(): void {
    this.selectedTask = null;
    this.refreshTrigger++;
  }

  onTaskCancelled(): void {
    this.selectedTask = null;
  }

  logout(): void {
    this.authService.logout();
  }
}
