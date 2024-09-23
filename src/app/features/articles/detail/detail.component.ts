import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleDTO } from '../../../shared/models/article.dto';
import { AuthService } from '../../auth/auth.service';
import { ArticlesService } from '../articles.service';
import { UserDashboardDTO } from '../../../shared/models/user-dashboard.dto';
import { UsersService } from '../../users/users.service';
import { BookingService } from '../bookings.service';
import { LoanService } from '../loans.service';

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
    private bookingService: BookingService,
    private loanService: LoanService
  ) { }

  ngOnInit(): void {
    this.setupButtonText();

    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.loadArticleDetails(articleId);
    } else {
      this.router.navigate(['/articles/search']);
    }
    if (history.state.userId || !this.isAdmin) {
      const selectedUserId = history.state.userId || this.authService.getUserId();
      this.loadUserInfo(selectedUserId, 'selectedUser');
    }
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
    return !this.isAdmin || history.state.userId;
  }

  selectUser(): void {
    this.router.navigate(['/admin/users/search'], {
      state: { fromArticlePage: true, articleId: this.article!.id },
    });

  }

  canBookArticle(): boolean {
    if (!this.isUserSelected) {
      return false;
    }
    if (this.article!.state === 'AVAILABLE') {
      return true;
    }
    if (this.article!.state === 'ONLOAN') {
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
    this.bookingService.bookArticle(this.selectedUser?.id!, this.article!.id!).subscribe({
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
  }

  canCancelBooking(): boolean {
    if (!this.isArticleBooked())
      return false;

    if (this.isAdmin || this.isArticleBookedByCurrentUser())
      return true;

    return false;
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

  cancelBooking(): void {
    this.bookingService.cancelBooking(this.article!.bookingDTO!.id!).subscribe({
      next: () => {
        console.log('Booking cancelled successfully');
        if (history.state.userId != this.article?.bookingDTO?.bookingUserId) {
          this.loadArticleDetails(this.article!.id!);
        }else if (history.state.userId) {
          this.router.navigate(['/admin/dashboard', history.state.userId], {
            state: { message: 'Booking cancelled successfully' },
          });
        } else if (this.isAdmin) {
          this.router.navigate(['/admin/dashboard', history.state.userId], {
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

  canRegisterLoan(): boolean {
    if (!this.isAdmin) {
      return false;
    }
    if (!this.isUserSelected) {
      return false;
    }
    if (this.article!.state === 'AVAILABLE') {
      return true;
    }
    if (this.article!.state === 'BOOKED' && this.selectedUser?.id === this.article!.bookingDTO?.bookingUserId) {
      return true;
    }
    return false;
  }


  registerLoan(): void {
      this.loanService.registerLoan(this.selectedUser!.id, this.article!.id!).subscribe({
        next: () => {
          console.log('Loan registered successfully');
          this.router.navigate(['/admin/dashboard', history.state.userId], {
            state: { message: 'Loan registered successfully' },
          });
        },
        error: (error) => {
          console.error('Error registering loan', error);
          this.errorMessage = error.error.error || 'An error occurred while registering the loan.';
        },
      });
  }

  isArticleOnLoan(): boolean {
    return (this.article?.state === 'ONLOAN' || this.article?.state === 'ONLOANBOOKED')
  }

  canRegisterReturn(): boolean {
    if (!this.isArticleOnLoan()) {
      return false;
    }
    if(!this.isAdmin) {
      return false;
    }
    return true;
  }

  registerReturn(): void {
    this.loanService.registerReturn(this.article?.loanDTO?.id!).subscribe({
      next: () => {
        console.log('Article returned successfully');
        if (history.state.userId != this.article?.bookingDTO?.bookingUserId) {
          this.loadArticleDetails(this.article!.id!);
        }
          this.router.navigate(['/admin/dashboard', history.state.userId], {
            state: { message: 'Article returned successfully' },
          });
      },
      error: (error) => {
        console.error('Error returning article', error);
        this.errorMessage =
          error.error.error ||
          'An error occurred while returning the article.';
      },
    });
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
      this.router.navigate(['/articles/search'], { state: { searchFormData: history.state.searchFormData, articles: history.state.articles, userId: history.state.userId } });
    } else if (history.state.fromUserBooking) {
      this.router.navigate(['/admin/users/search'], { state: { fromArticlePage: true, articleId: this.article?.id, searchFormData: history.state.searchFormData, users: history.state.users } });
    } else {
      this.router.navigate(['/articles/search']);
    }
  }


  goToUserDashboard(userId: string): void {
    this.router.navigate(['/admin/dashboard', userId]);
  }

}
