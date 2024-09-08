import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { UserDTO } from '../../shared/models/user.dto';

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
}
