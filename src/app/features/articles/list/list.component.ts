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
    this.router.navigate(['/articles/details', article.id], { state: { article, searchFormData: this.searchFormData, articles: this.articles } });
  }

  canPerformAction(article: ArticleDTO, action: string): boolean {
    // Define logic to enable/disable buttons based on article state and user role
    return this.isAdmin; // Example logic for admin
  }

  modifyArticle(article: ArticleDTO): void {
    // Perform actions on modifying an article, such as navigation to edit article page
  }

  bookArticle(article: ArticleDTO): void {
    // Perform actions on booking an article, such as navigation to book article page
  }

  unbookArticle(article: ArticleDTO): void {
    // Perform actions on unbooking an article, such as navigation to unbook article page
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
