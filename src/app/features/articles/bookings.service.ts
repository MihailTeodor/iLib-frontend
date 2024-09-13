import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.backendUrl}/bookingsEndpoint`;

  constructor(private http: HttpClient) {}

  bookArticle(userId: string, articleId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('userId', userId.toString());
    params = params.append('articleId', articleId.toString());

    return this.http.post(`${this.apiUrl}`, null, { headers, params });
  }
  
  cancelBooking(bookingId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch(`${this.apiUrl}/${bookingId}/cancel`, null, { headers });
  }

  getAllBookings(userId: string, pageNumber: number, resultsPerPage: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('resultsPerPage', resultsPerPage.toString());

    return this.http.get(`${this.apiUrl}/${userId}/bookings`, { headers, params });
  }
}
