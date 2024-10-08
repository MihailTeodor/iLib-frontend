import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleDTO } from '../../shared/models/article.dto';
import { BackendService } from '../../shared/backend.service';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient, private backendService: BackendService) {}

  private get apiUrl(): string {
    return `${this.backendService.getBackendUrl()}/articlesEndpoint`;
  }

  addArticle(article: ArticleDTO): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}`, article, { headers });
  }

  getArticleById(articleId: string): Observable<ArticleDTO> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<ArticleDTO>(`${this.apiUrl}/${articleId}`, { headers });
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
  
  deleteArticle(articleId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${articleId}`, { headers });
  }
  
}
