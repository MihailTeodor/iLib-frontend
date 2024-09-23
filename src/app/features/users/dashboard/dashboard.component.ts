import { Component, OnInit } from '@angular/core';
import { UserDashboardDTO } from '../../../shared/models/user-dashboard.dto';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDTO } from '../../../shared/models/booking.dto';
import { BookingService } from '../../articles/bookings.service';
import { LoanDTO } from '../../../shared/models/loan.dto';
import { LoanService } from '../../articles/loans.service';

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
  currentBookingsPage: number = 1;
  currentLoansPage: number = 1;
  totalBookingResults: number = 0; 
  totalLoansResults: number = 0; 
  totalBookingPages: number = 1;
  totalLoansPages: number = 1;
  bookings: BookingDTO[] = [];
  loans: LoanDTO[] = [];

  constructor(
    private route: ActivatedRoute, 
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id') || this.authService.getUserId();
    this.loadUserDashboard(userId!);
  }

  adjustMaxElementsPerPage(): void {
    if (window.innerWidth <= 768) {
      this.maxBookingsPerPage = 3;
      this.maxLoansPerPage = 3;
    } else {
      this.maxBookingsPerPage = 5;
      this.maxLoansPerPage = 5;
    }
  }

  loadUserDashboard(userId: string): void {
    this.usersService.getUserInfo(userId).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.bookings = data.bookings || [];
        this.loans = data.loans || [];
        this.totalBookingResults = data.totalBookings;
        this.totalLoansResults = data.totalLoans;
        this.totalBookingPages = Math.ceil(this.totalBookingResults / this.maxBookingsPerPage);
        this.totalLoansPages = Math.ceil(this.totalLoansResults / this.maxLoansPerPage);
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while fetching your information.';
      }
    });
  }

  loadBookingHistory(pageNumber: number = 1): void {
    const userId = this.userInfo?.id || this.authService.getUserId();
    this.bookingService.getAllBookings(userId!, pageNumber, this.maxBookingsPerPage).subscribe({
      next: (response) => {
        this.bookings = response.items;
        this.totalBookingResults = response.totalResults;
        this.totalBookingPages = response.totalPages;
        this.currentBookingsPage = response.pageNumber;
      },
      error: (error) => {
        if (error.status === 404 && error.error?.error === 'No bookings relative to the specified user found!') {
          this.bookings = [];
          this.totalBookingResults = 0;
          this.totalBookingPages = 1;
          this.currentBookingsPage = 1;
        } else {
          this.errorMessage = 'An error occurred while fetching the booking history.';
        }
      }
    });
  }

  loadLoansHistory(pageNumber: number = 1): void {
    const userId = this.userInfo?.id || this.authService.getUserId();
    this.loanService.getAllLoans(userId!, pageNumber, this.maxLoansPerPage).subscribe({
      next: (response) => {
        this.loans = response.items;
        this.totalLoansResults = response.totalResults;
        this.totalLoansPages = response.totalPages;
        this.currentLoansPage = response.pageNumber;
      },
      error: (error) => {
        if (error.status === 404 && error.error?.error === 'No loans relative to the specified user found!') {
          this.loans = [];
          this.totalLoansResults = 0;
          this.totalLoansPages = 1;
          this.currentLoansPage = 1;
        } else {
          this.errorMessage = 'An error occurred while fetching the loans history.';
        }
      }
    });
  }

  toggleBookingHistory(): void {
    if (this.showAllBookings) {
      this.currentBookingsPage = 1;
      this.bookings = this.userInfo?.bookings || [];
    } else {
      this.loadBookingHistory(1);
    }
    this.showAllBookings = !this.showAllBookings;
  }

  toggleLoanHistory(): void {
    if (this.showAllLoans) {
      this.currentLoansPage = 1;
      this.loans = this.userInfo?.loans || [];
    } else {
      this.loadLoansHistory(1);
    }
    this.showAllLoans = !this.showAllLoans;
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

  nextBookingPage(): void {
    if (this.currentBookingsPage < this.totalBookingPages) {
      this.loadBookingHistory(this.currentBookingsPage + 1);
    }
  }

  nextLoanPage(): void {
    if (this.currentLoansPage < this.totalLoansPages) {
      this.loadLoansHistory(this.currentLoansPage + 1);
    }
  }

  previousBookingPage(): void {
    if (this.currentBookingsPage > 1) {
      this.loadBookingHistory(this.currentBookingsPage - 1);
    }
  }

  previousLoanPage(): void {
    if (this.currentLoansPage > 1) {
      this.loadLoansHistory(this.currentLoansPage - 1);
    }
  }

  goToArticleDetails(articleId: string): void {
    if (this.authService.getUserRole() === 'ADMINISTRATOR') {
      this.router.navigate(['/articles/details', articleId], { state: { fromUserDashboard: true, userId: this.userInfo?.id } });
    } else {
      this.router.navigate(['/articles/details', articleId], { state: { fromDashboard: true} });
    }
  }
}
