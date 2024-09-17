import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleDTO } from '../../../shared/models/article.dto';
import { AuthService } from '../../auth/auth.service';
import { ArticlesService } from '../articles.service';
import { UserDashboardDTO } from '../../../shared/models/user-dashboard.dto';
import { UsersService } from '../../users/users.service';
import { BookingService } from '../bookings.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleDTO | null = null;
  selectedUser: UserDashboardDTO | null = null;
  bookingUser: UserDashboardDTO | null = null;
  loaningUser: UserDashboardDTO | null = null;
  errorMessage: string | null = null;
  buttonText: string = 'Go to Search';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private articlesService: ArticlesService,
    private usersService: UsersService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.setupButtonText();

    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.loadArticleDetails(articleId);
    } else {
      this.router.navigate(['/articles/search']);
    }

    const selectedUserId = history.state.userId || this.authService.getUserId();
    this.loadUserInfo(selectedUserId, 'selectedUser');
  }

  setupButtonText(): void {
    if (history.state.fromDashboard) {
      this.buttonText = 'Go to Search';
    } else if (history.state.fromSearch) {
      this.buttonText = 'Back to Search';
    } else if (history.state.fromUserDashboard) {
      this.buttonText = 'Back to User Dashboard';
    } else if (history.state.fromUserBooking) {
      this.buttonText = 'Back to User Search';
    } else {
      this.buttonText = 'Go to Search';
    }
  }

  loadArticleDetails(articleId: string): void {
    this.articlesService.getArticleById(articleId).subscribe({
      next: (article: ArticleDTO) => {
        this.article = article;

        if (this.article?.bookingDTO && this.isAdmin) {
          this.loadUserInfo(this.article.bookingDTO.bookingUserId, 'bookingUser');
        }
    
        if (this.article?.loanDTO && this.isAdmin) {
          this.loadUserInfo(this.article.loanDTO.loaningUserId, 'loaningUser');
        }
      },
      error: (error) => {
        this.errorMessage = 'Error fetching article details';
        this.router.navigate(['/articles/search']);
      },
    });
  }

  loadUserInfo(userId: string, userType: 'selectedUser' | 'bookingUser' | 'loaningUser'): void {
    this.usersService.getUserInfo(userId).subscribe({
      next: (data) => {
        if (userType === 'selectedUser') {
          this.selectedUser = data;
        } else if (userType === 'bookingUser') {
          this.bookingUser = data;
        } else if (userType === 'loaningUser') {
          this.loaningUser = data;
        }
      },
      error: () => {
        this.errorMessage = `Error fetching ${userType} data`;
      },
    });
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATOR';
  }

  get isUserSelected(): boolean {
    return history.state.userId;
  }

  canBookArticle(): boolean {
    if (!this.article) {
      return false;
    }
    if (this.article.state === 'AVAILABLE') {
      return true;
    }
    if (this.article.state === 'ONLOAN') {
      return !this.isArticleOnLoanByCurrentUser();
    }
    return false;
  }

  isArticleOnLoanByCurrentUser(): boolean {
    if (this.article?.loanDTO) {
      return this.article.loanDTO.loaningUserId === this.selectedUser?.id && this.article.loanDTO.state === 'ACTIVE';
    }
    return false;
  }

  bookArticle(): void {
    const isAdminBooking = this.isAdmin && !history.state.userId;

    if (this.article && isAdminBooking) {
      this.router.navigate(['/admin/users/search'], {
        state: { fromArticleBooking: true, articleId: this.article.id },
      });
    } else {
      if (this.article && this.selectedUser?.id && this.canBookArticle()) {
        this.bookingService.bookArticle(this.selectedUser?.id, this.article.id!).subscribe({
          next: () => {
            console.log('Article booked successfully');

            if (history.state.userId) {
              this.router.navigate(['/admin/dashboard', history.state.userId], {
                state: { message: 'Article booked successfully' },
              });
            } else {
              this.router.navigate(['/users'], {
                state: { message: 'Article booked successfully' },
              });
            }
          },
          error: (error) => {
            console.error('Error booking article', error);
            this.errorMessage =
              error.error.error ||
              'An error occurred while booking the article.';
          },
        });
      } else {
        this.errorMessage = 'This article cannot be booked at the moment.';
      }
    }
  }

  cancelBooking(): void {
    if (this.article?.bookingDTO) {
      this.bookingService.cancelBooking(this.article.bookingDTO.id!).subscribe({
        next: () => {
            console.log('Booking cancelled successfully');
            if (history.state.userId) {
              this.router.navigate(['/admin/dashboard', history.state.userId], {
                state: { message: 'Booking cancelled successfully' },
              });
            } else if (this.isAdmin) {
              this.router.navigate(['/admin'], {
                state: { message: 'Booking cancelled successfully' },
              });
            } else {
              this.router.navigate(['/users'], {
                state: { message: 'Booking cancelled successfully' },
              });
            }
          },
          error: (error) => {
            console.error('Error cancelling booking', error);
            this.errorMessage =
              error.error.error ||
              'An error occurred while cancelling the booking.';
          },
        });
      }
    }

  isArticleBookedByCurrentUser(): boolean {
    if (this.article?.bookingDTO) {
      return (
        this.article.bookingDTO.bookingUserId === this.selectedUser?.id &&
        this.article.bookingDTO.state === 'ACTIVE'
      );
    }
    return false;
  }

  isArticleBooked(): boolean {
    return (this.article?.state === 'BOOKED' || this.article?.state === 'ONLOANBOOKED')
  }

  editArticle(): void {
    this.router.navigate(['/admin/articles/edit', this.article?.id], {
      state: { article: this.article },
    });
  }

  deleteArticle(): void {
    if (this.article) {
      const confirmation = window.confirm(
        'Are you sure you want to delete this article?'
      );
      if (confirmation) {
        this.articlesService.deleteArticle(this.article.id!).subscribe({
          next: () => {
            console.log('Article deleted successfully');
            this.router.navigate(['/admin'], {
              state: { message: 'Article deleted successfully' },
            });
          },
          error: (error) => {
            console.error('Error deleting article', error);
            alert('An error occurred while deleting the article.');
          },
        });
      }
    }
  }

  goBack(): void {
    if (history.state.fromUserDashboard) {
      this.router.navigate(['/admin/dashboard', history.state.userId]);
    } else if (history.state.fromSearch) {
      this.router.navigate(['/articles/search'], { state: { searchFormData: history.state.searchFormData, articles: history.state.articles } });
    } else if (history.state.fromUserBooking) {
      this.router.navigate(['/admin/users/search'], { state: { fromArticleBooking: true, articleId: this.article?.id, searchFormData: history.state.searchFormData, users: history.state.users } });
    } else {
      this.router.navigate(['/articles/search']);
    }
  }


  goToUserDashboard(userId: string): void {
    this.router.navigate(['/admin/dashboard', userId]);
  }
  
}
