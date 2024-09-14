import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleDTO } from '../../../shared/models/article.dto';
import { AuthService } from '../../auth/auth.service';
import { ArticlesService } from '../articles.service';
import { UserDashboardDTO } from '../../../shared/models/user-dashboard.dto';
import { UsersService } from '../../users/users.service';
import { LoanDTO } from '../../../shared/models/loan.dto';
import { BookingService } from '../bookings.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleDTO | null = null;
  userInfo: UserDashboardDTO | null = null;
  errorMessage: string | null = null;
  buttonText: string = 'Go to Search';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService,
    private articlesService: ArticlesService,
    private usersService: UsersService,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    const fromDashboard = history.state.fromDashboard;
    const fromSearch = history.state.fromSearch;
    const fromUserDashboard = history.state.fromUserDashboard;
    
    if (fromDashboard) {
      this.buttonText = 'Go to Search';
    } else if (fromSearch) {
      this.buttonText = 'Back to Search';
    } else if (fromUserDashboard) {
      this.buttonText = 'Back to User Dashboard';
    } else {
      this.buttonText = 'Go to Search';
    }
  
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.loadArticleDetails(articleId);
    } else {
      this.router.navigate(['/articles/search']);
    }
  
    const userId = history.state.userId || this.authService.getUserId();
    this.usersService.getUserInfo(userId!).subscribe({
      next: (data) => {
        this.userInfo = data;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching user data';
      }
    });
  }
  
  
  loadArticleDetails(articleId: string): void {
    this.articlesService.getArticleById(articleId).subscribe({
      next: (article: ArticleDTO) => {
        this.article = article;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching article details';
        this.router.navigate(['/articles/search']);
      }
    });
  }
  
  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATOR';
  }
  
  canBookArticle(): boolean {
    if (!this.article || !this.userInfo) {
      return false;
    }
    if (this.article.state === 'AVAILABLE') {
      return true;
    }
    if (this.article.state === 'ONLOAN') {
      return !this.isArticleOnLoanByCurrentUser(this.article.id!);
    }
    return false;
  }

    isArticleOnLoanByCurrentUser(articleId: string): boolean {
      return this.userInfo?.loans.some((loan: LoanDTO) => loan.articleId === articleId && loan.state === 'ACTIVE') || false;
    }
    
    bookArticle(): void {
      const userId = history.state.userId || this.authService.getUserId();
      if (this.article && userId) {
        this.bookingService.bookArticle(userId, this.article.id!).subscribe({
          next: () => {
            console.log('Article booked successfully');
            
            if (history.state.userId) {
              this.router.navigate(['/admin/dashboard', history.state.userId], { state: { message: 'Article booked successfully' } });
            } else {
              this.router.navigate(['/users'], { state: { message: 'Article booked successfully' } });
            }
          },
          error: (error) => {
            console.error('Error booking article', error);
            this.errorMessage = error.error.error || 'An error occurred while booking the article.';
          }
        });
      }
    }
    

    cancelBooking(): void {
      if (this.article && this.userInfo) {
        const booking = this.userInfo.bookings.find(b => b.bookedArticleId === this.article?.id);
        if (booking) {
          this.bookingService.cancelBooking(booking.id!.toString()).subscribe({
            next: () => {
              console.log('Booking cancelled successfully');
              if (history.state.userId) {
                this.router.navigate(['/admin/dashboard', history.state.userId], { state: { message: 'Booking cancelled successfully' } });
              } else {
                this.router.navigate(['/users'], { state: { message: 'Booking cancelled successfully' } });
              }
            },
            error: (error) => {
              console.error('Error cancelling booking', error);
              this.errorMessage = error.error.error || 'An error occurred while cancelling the booking.';
            }
          });
        }
      }
    }
    
    
   isArticleBookedByCurrentUser(): boolean {
    return !!this.userInfo?.bookings.some(booking => booking.bookedArticleId === this.article?.id && booking.state === 'ACTIVE');
  }

  
  editArticle(): void {
    this.router.navigate(['/admin/articles/edit', this.article?.id], { state: { article: this.article } });
  }

  deleteArticle(): void {
    if (this.article) {
      const confirmation = window.confirm('Are you sure you want to delete this article?');
      if (confirmation) {
        this.articlesService.deleteArticle(this.article.id!).subscribe({
          next: () => {
            console.log('Article deleted successfully');
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
    if (history.state.fromUserDashboard) {
      const userId = history.state.userId;
      this.router.navigate(['/admin/dashboard', userId]);
    } else if (history.state.fromSearch) {
      const searchFormData = history.state.searchFormData;
      const articles = history.state.articles;
      this.router.navigate(['/articles/search'], { state: { searchFormData, articles } });
    } else {
      this.router.navigate(['/articles/search']);
    }
  }  
}
