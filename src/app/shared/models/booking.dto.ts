export interface BookingDTO {
    id?: string;
    bookedArticleId: string;
    bookedArticleTitle?: string;
    bookingUserId: string;
    bookingDate: Date;
    bookingEndDate: Date;
    state: BookingState;
}


export enum BookingState {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    EXPIRED = 'EXPIRED',
}