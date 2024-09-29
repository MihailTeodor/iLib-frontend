import { Component, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { UserDTO } from '../../../shared/models/user.dto';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UserListComponent implements OnChanges, AfterViewInit {
  @Input() users: UserDTO[] = [];
  @Input() totalResults: number = 0;
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() searchFormData: any = {};

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = ['name', 'surname', 'email', 'telephoneNumber', 'actions'];
  dataSource = new MatTableDataSource<UserDTO>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = 10;
  pageSizeOptions = [5, 10, 15, 20];

  constructor(private router: Router) { }

  ngOnChanges(): void {
    this.dataSource.data = this.users;
    if (this.paginator) {
      this.paginator.pageIndex = this.currentPage - 1;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSelectUser(user: UserDTO, event: Event): void {
    event.stopPropagation();
    if (history.state.fromArticlePage) {
      const articleId = history.state.articleId;
      if (articleId) {
        this.router.navigate(['/articles/details', articleId], {
          state: {
            userId: user.id,
            fromUserBooking: true,
            searchFormData: this.searchFormData,
            users: this.users
          }
        });
      }
    } else {
      this.router.navigate(['/users/detail', user.id], {
        state: {
          user,
          searchFormData: this.searchFormData,
          users: this.users
        }
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageChange.emit(event.pageIndex + 1);
  }
}
