import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ArticleDTO } from '../../shared/models/article.dto';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private apiUrl = `${environment.backendUrl}/articlesEndpoint`;

  constructor(private http: HttpClient) {}

  addArticle(article: ArticleDTO): Observable<any> {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    // Define the headers with the Authorization bearer token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Add the token to the Authorization header
    });

    return this.http.post(`${this.apiUrl}`, article, { headers });
  }

  searchArticles(searchParams: any): Observable<any> {
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

  updateArticle(article: ArticleDTO): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put(`${this.apiUrl}/${article.id}`, article, { headers });
  }
  
  deleteArticle(articleId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${articleId}`, { headers });
  }
}
