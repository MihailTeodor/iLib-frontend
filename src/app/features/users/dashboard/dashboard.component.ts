import { Component, OnInit } from '@angular/core';
import { UserDashboardDTO } from '../../../shared/models/user-dashboard.dto';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDTO } from '../../../shared/models/booking.dto';
import { BookingService } from '../../articles/bookings.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  userInfo: UserDashboardDTO | null = null;
  errorMessage: string | null = null;
  showAllBookings: boolean = false;
  maxBookingsPerPage: number = 5;
  currentPage: number = 1;
  totalResults: number = 0; 
  totalPages: number = 1;
  bookings: BookingDTO[] = [];

  constructor(
    private route: ActivatedRoute, 
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id') || this.authService.getUserId();
    this.loadUserDashboard(userId!);
  }

  adjustMaxBookingsPerPage(): void {
    if (window.innerWidth <= 768) {
      this.maxBookingsPerPage = 3;
    } else {
      this.maxBookingsPerPage = 5;
    }
  }

  loadUserDashboard(userId: string): void {
    this.usersService.getUserInfo(userId).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.bookings = data.bookings || [];
        this.totalResults = data.totalBookings;
        this.totalPages = Math.ceil(this.totalResults / this.maxBookingsPerPage);
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
        this.totalResults = response.totalResults;
        this.totalPages = response.totalPages;
        this.currentPage = response.pageNumber;
      },
      error: (error) => {
        if (error.status === 404 && error.error?.error === 'No bookings relative to the specified user found!') {
          this.bookings = [];
          this.totalResults = 0;
          this.totalPages = 1;
          this.currentPage = 1;
        } else {
          this.errorMessage = 'An error occurred while fetching the booking history.';
        }
      }
    });
  }

  toggleBookingHistory(): void {
    if (this.showAllBookings) {
      this.currentPage = 1;
      this.bookings = this.userInfo?.bookings || [];
    } else {
      this.loadBookingHistory(1);
    }
    this.showAllBookings = !this.showAllBookings;
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

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadBookingHistory(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadBookingHistory(this.currentPage - 1);
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
