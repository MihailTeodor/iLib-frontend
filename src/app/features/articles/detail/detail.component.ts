import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleDTO } from '../../../shared/models/article.dto';
import { AuthService } from '../../auth/auth.service';
import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleDTO | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService,
    private articlesService: ArticlesService,
  ) {}

  ngOnInit(): void {
    // Retrieve the article from the router's state
    if (history.state.article) {
      this.article = history.state.article;
    } else {
      // If the user navigated directly here without data, you could redirect to search or show an error
      this.router.navigate(['/articles/search']);
    }
  }

  // Check if the user is an admin
  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATOR';
  }
  
  // Navigate to edit form
  editArticle(): void {
    this.router.navigate(['/admin/articles/edit', this.article?.id], { state: { article: this.article } });
  }

      // Delete article
  deleteArticle(): void {
    if (this.article) {
      const confirmation = window.confirm('Are you sure you want to delete this article?');
      if (confirmation) {
        this.articlesService.deleteArticle(this.article.id!).subscribe({
          next: () => {
            console.log('Article deleted successfully');
            // Redirect to the admin dashboard with a success message
            this.router.navigate(['/admin'], { state: { message: 'Article deleted successfully' } });
          },
          error: (error) => {
            console.error('Error deleting article', error);
            alert('An error occurred while deleting the article.');
          }
        });
      }
    }
  }

  goBack(): void {
    const searchFormData = history.state.searchFormData;
    const articles = history.state.articles;
    this.router.navigate(['/articles/search'], { state: { searchFormData, articles } });
  }
  
}
