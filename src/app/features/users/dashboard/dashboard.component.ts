import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDashboardDTO } from '../../../shared/models/user-dashboard.dto';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDTO } from '../../../shared/models/booking.dto';
import { BookingService } from '../../articles/bookings.service';
import { LoanDTO } from '../../../shared/models/loan.dto';
import { LoanService } from '../../articles/loans.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  userInfo: UserDashboardDTO | null = null;
  errorMessage: string | null = null;
  showAllBookings: boolean = false;
  showAllLoans: boolean = false;
  maxBookingsPerPage: number = 5;
  maxLoansPerPage: number = 5;
  totalBookingResults: number = 0;
  totalLoansResults: number = 0;
  bookings: BookingDTO[] = [];
  loans: LoanDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService,
    private loanService: LoanService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id') || this.authService.getUserId();
    this.loadUserDashboard(userId!);
  }

  loadUserDashboard(userId: string): void {
    this.usersService.getUserInfo(userId).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.bookings = data.bookings || [];
        this.loans = data.loans || [];
        this.totalBookingResults = data.totalBookings;
        this.totalLoansResults = data.totalLoans;
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while fetching your information.';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 5000,
        });
      }
    });
  }

  loadBookingHistory(pageEvent?: PageEvent): void {
    const pageNumber = pageEvent ? pageEvent.pageIndex + 1 : 1;
    const userId = this.userInfo?.id || this.authService.getUserId();
    this.bookingService.getAllBookings(userId!, pageNumber, this.maxBookingsPerPage).subscribe({
      next: (response) => {
        this.bookings = response.items;
        this.totalBookingResults = response.totalResults;
      },
      error: (error) => {
        if (error.status === 404 && error.error?.error === 'No bookings relative to the specified user found!') {
          this.bookings = [];
          this.totalBookingResults = 0;
        } else {
          this.errorMessage = 'An error occurred while fetching the booking history.';
          this.snackBar.open(this.errorMessage, 'Close', {
            duration: 5000,
          });
        }
      }
    });
  }

  loadLoansHistory(pageEvent?: PageEvent): void {
    const pageNumber = pageEvent ? pageEvent.pageIndex + 1 : 1;
    const userId = this.userInfo?.id || this.authService.getUserId();
    this.loanService.getAllLoans(userId!, pageNumber, this.maxLoansPerPage).subscribe({
      next: (response) => {
        this.loans = response.items;
        this.totalLoansResults = response.totalResults;
      },
      error: (error) => {
        if (error.status === 404 && error.error?.error === 'No loans relative to the specified user found!') {
          this.loans = [];
          this.totalLoansResults = 0;
        } else {
          this.errorMessage = 'An error occurred while fetching the loans history.';
          this.snackBar.open(this.errorMessage, 'Close', {
            duration: 5000,
          });
        }
      }
    });
  }

  toggleBookingHistory(): void {
    this.showAllBookings = !this.showAllBookings;
    if (this.showAllBookings) {
      this.loadBookingHistory();
    } else {
      this.bookings = this.userInfo?.bookings || [];
    }
  }

  toggleLoanHistory(): void {
    this.showAllLoans = !this.showAllLoans;
    if (this.showAllLoans) {
      this.loadLoansHistory();
    } else {
      this.loans = this.userInfo?.loans || [];
    }
  }

  onBookingPageChange(event: PageEvent): void {
    this.loadBookingHistory(event);
  }

  onLoanPageChange(event: PageEvent): void {
    this.loadLoansHistory(event);
  }

  searchArticles(): void {
    if (this.authService.getUserRole() === 'ADMINISTRATOR') {
      this.router.navigate(['/articles/search'], { state: { fromUserDashboard: true, userId: this.userInfo?.id } });
    } else {
      this.router.navigate(['/articles/search'], { state: { fromUserDashboard: true } });
    }
  }

  isBookingActive(booking: BookingDTO): boolean {
    return booking.state === 'ACTIVE';
  }

  isLoanActive(loan: LoanDTO): boolean {
    return loan.state === 'ACTIVE';
  }

  goToArticleDetails(articleId: string): void {
    if (this.authService.getUserRole() === 'ADMINISTRATOR') {
      this.router.navigate(['/articles/details', articleId], { state: { fromUserDashboard: true, userId: this.userInfo?.id } });
    } else {
      this.router.navigate(['/articles/details', articleId], { state: { fromDashboard: true } });
    }
  }
}
