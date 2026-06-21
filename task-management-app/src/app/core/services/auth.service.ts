import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, StoredCredentials } from '../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:5000/api/auth';
  private readonly CREDS_KEY = 'tm_credentials';

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, request).pipe(
      tap(res => {
        if (res.success) {
          const creds: StoredCredentials = { username: request.username, password: request.password };
          sessionStorage.setItem(this.CREDS_KEY, btoa(JSON.stringify(creds)));
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.CREDS_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getCredentials();
  }

  getCredentials(): StoredCredentials | null {
    const raw = sessionStorage.getItem(this.CREDS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(atob(raw)) as StoredCredentials;
    } catch {
      return null;
    }
  }

  getBasicAuthHeader(): string {
    const creds = this.getCredentials();
    if (!creds) return '';
    return 'Basic ' + btoa(`${creds.username}:${creds.password}`);
  }

  getCurrentUsername(): string {
    return this.getCredentials()?.username ?? '';
  }
}
