import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { UserDTO } from '../../shared/models/user.dto';
import { UserDashboardDTO } from '../../shared/models/user-dashboard.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.backendUrl}/usersEndpoint`;

  constructor(private http: HttpClient) {}

  createUser(user: UserDTO): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}`, user, { headers });
  }

  searchUsers(searchParams: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        params = params.append(key, searchParams[key]);
      }
    });

    return this.http.get(`${this.apiUrl}`, { headers, params });
  }

  updateUser(user: UserDTO): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/${user.id}`, user, { headers });
  }

  getUserInfo(userId: string): Observable<UserDashboardDTO> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UserDashboardDTO>(`${this.apiUrl}/${userId}`, { headers });
  }
}
