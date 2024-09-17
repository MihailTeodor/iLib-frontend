import { BookingDTO } from "./booking.dto";
import { LoanDTO } from "./loan.dto";

export interface ArticleDTO {
    id?: string;
    type: ArticleType;
    location: string;
    title: string;
    yearEdition: Date;
    publisher: string;
    genre: string;
    description?: string;
    state?: ArticleState;
    author?: string;
    isbn?: string;
    issueNumber?: number;
    issn?: string;
    director?: string;
    isan?: string;
    loanDTO?: LoanDTO;
    bookingDTO?:BookingDTO;
  }
  
  export enum ArticleState {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE= 'UNAVAILABLE',
    ONLOAN = 'ONLOAN',
    BOOKED = 'BOOKED',
    ONLOANBOOKED = 'ONLOANBOOKED'
  }
  
  export enum ArticleType {
    BOOK = 'BOOK',
    MAGAZINE = 'MAGAZINE',
    DVD = 'MOVIEDVD'
  }
  