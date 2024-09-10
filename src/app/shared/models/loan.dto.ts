export interface LoanDTO {
    id?: number;
    articleId: number;
    articleTitle: string;
    loaningUserId: number;
    loanDate: Date;
    dueDate: Date;
    renewed: boolean;
    state: LoanState;
}

export enum LoanState {
    ACTIVE = 'ACTIVE',
    RETURNED = 'RETURNED',
    OVERDUE = 'OVERDUE',
}