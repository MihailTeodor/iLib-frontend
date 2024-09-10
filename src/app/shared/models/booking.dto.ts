export interface BookingDTO {
    id?: number;
    bookedArticleId: number;
    bookedArticleTitle?: string;
    bookingUserId: number;
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