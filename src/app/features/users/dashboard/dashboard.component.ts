import { Component, OnInit } from '@angular/core';
import { UserDashboardDTO } from '../../../shared/models/user-dashboard.dto';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
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
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService,

  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId(); 
    this.loadUserDashboard(userId!);
  }

  loadUserDashboard(userId: string): void {
    this.usersService.getUserInfo(userId).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.bookings = data.bookings;  
        this.totalResults = data.bookings.length;
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while fetching your information.';
      }
    });
  }

  loadBookingHistory(pageNumber: number = 1): void {
    const userId = this.authService.getUserId();
    this.bookingService.getAllBookings(userId!, pageNumber, this.maxBookingsPerPage).subscribe({
      next: (response) => {
        this.bookings = response.items;
        this.totalResults = response.totalResults;
        this.totalPages = response.totalPages;
        this.currentPage = response.pageNumber;
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while fetching the booking history.';
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
    this.router.navigate(['/articles/search']);
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
    this.router.navigate(['/articles/details', articleId], { state: { fromDashboard: true } });
  }
}