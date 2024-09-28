import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BackendService } from '../../shared/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private backendService: BackendService) {}

  private get apiUrl(): string {
    return `${this.backendService.getBackendUrl()}/auth/login`;
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, credentials, { headers })
      .pipe(
        map(response => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userRole', response.role);
          return response;
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.router.navigate(['/auth/login']);  
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
}
