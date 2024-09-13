export interface LoanDTO {
    id?: string;
    articleId: string;
    articleTitle: string;
    loaningUserId: string;
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