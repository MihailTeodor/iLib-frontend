import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { ArticleDTO } from '../../../shared/models/article.dto';
import { AuthService } from '../../../features/auth/auth.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-article-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ArticleListComponent implements OnChanges, AfterViewInit {
  @Input() articles: ArticleDTO[] = [];
  @Input() totalResults: number = 0;
  @Input() currentPage: number = 1;
  @Input() searchFormData: any = {};
  @Input() pageSize: number = 10;

  @Output() pageChange: EventEmitter<{ pageNumber: number; pageSize: number }> = new EventEmitter();

  displayedColumns: string[] = ['title', 'publisher', 'year', 'type', 'location', 'state', 'actions'];
  dataSource = new MatTableDataSource<ArticleDTO>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  pageSizeOptions = [5, 10, 15, 20];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnChanges(): void {
    this.dataSource.data = this.articles;
      
    if (this.paginator) {
      this.paginator.pageIndex = this.currentPage - 1;
  
      setTimeout(() => {
        this.paginator.length = this.totalResults;
        this.paginator.pageSize = this.pageSize;
        this.paginator.pageIndex = this.currentPage - 1;

        
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATOR';
  }

  onSelectArticle(article: ArticleDTO, event: Event): void {
    event.stopPropagation();
    const userId = history.state.userId;
    this.router.navigate(['/articles/details', article.id], {
      state: {
        article,
        searchFormData: this.searchFormData,
        articles: this.articles,
        fromSearch: true,
        userId
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit({
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize
    });
  }
  
}
