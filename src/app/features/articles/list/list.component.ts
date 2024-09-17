import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleDTO } from '../../../shared/models/article.dto';
import { AuthService } from '../../../features/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-article-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ArticleListComponent {
  @Input() articles: ArticleDTO[] = [];
  @Input() totalResults: number = 0;
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() searchFormData: any = {};

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private authService: AuthService, private router: Router) { }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATOR';
  }

  onSelectArticle(article: ArticleDTO): void {
    const userId = history.state.userId;
    this.router.navigate(['/articles/details', article.id], { state: { article, searchFormData: this.searchFormData, articles: this.articles, fromSearch: true, userId} });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
