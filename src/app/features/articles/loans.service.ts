import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.backendUrl}/loansEndpoint`;

  constructor(private http: HttpClient) {}

  registerLoan(userId: string, articleId: string): Observable<any> {
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

  registerReturn(loanId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch(`${this.apiUrl}/${loanId}/return`, null, { headers });
  }

  getLoanInfo(loanId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/${loanId}`, { headers });
  }

  getAllLoans(userId: string, fromIndex: number, limit: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('fromIndex', fromIndex.toString());
    params = params.append('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/${userId}/loans`, { headers, params });
  }

  extendLoan(loanId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch(`${this.apiUrl}/${loanId}/extend`, null, { headers });
  }

}
