import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilter } from '../../shared/models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getAll(filter?: TaskFilter): Observable<Task[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.isCompleted !== null && filter.isCompleted !== undefined)
        params = params.set('isCompleted', String(filter.isCompleted));
      if (filter.priority)
        params = params.set('priority', filter.priority);
      if (filter.searchTerm)
        params = params.set('searchTerm', filter.searchTerm);
      if (filter.sortBy)
        params = params.set('sortBy', filter.sortBy);
      if (filter.sortDescending !== undefined)
        params = params.set('sortDescending', String(filter.sortDescending));
    }
    return this.http.get<Task[]>(this.API, { params });
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API}/${id}`);
  }

  create(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.API, request);
  }

  update(id: number, request: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.API}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
