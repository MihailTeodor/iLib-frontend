import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDTO } from '../../../shared/models/user.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UserListComponent {
  @Input() users: UserDTO[] = [];
  @Input() totalResults: number = 0;
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() searchFormData: any = {};

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router) { }

  onSelectUser(user: UserDTO): void {
    if (history.state.fromArticlePage) {
      const articleId = history.state.articleId;
      if (articleId) {
        this.router.navigate(['/articles/details', articleId], { state: { userId: user.id, fromUserBooking: true, searchFormData: this.searchFormData, users: this.users } });
      }
    } else {
      this.router.navigate(['/users/detail', user.id], { state: { user, searchFormData: this.searchFormData, users: this.users } });
    }
  }
  

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
