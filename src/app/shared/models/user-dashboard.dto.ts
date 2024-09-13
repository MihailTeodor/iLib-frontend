import { BookingDTO } from './booking.dto';
import { LoanDTO } from './loan.dto';

export interface UserDashboardDTO {
  id: string;
  name: string;
  surname: string;
  email: string;
  address?: string;
  telephoneNumber: string;
  loans: LoanDTO[];
  bookings: BookingDTO[];
}
