import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArticlesService } from '../../../features/articles/articles.service';
import { ArticleDTO } from '../../../shared/models/article.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-articles',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchArticlesComponent implements OnInit {
  searchForm: FormGroup;
  articles: ArticleDTO[] = [];
  totalResults: number = 0;
  currentPage: number = 1;
  formCollapsed: boolean = false;
  resultsPerPageOptions = [5, 10, 15, 20];

  constructor(
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      isbn: [''],
      issn: [''],
      isan: [''],
      title: [''],
      genre: [''],
      publisher: [''],
      yearEdition: [''],
      author: [''],
      issueNumber: [null],
      director: [''],
      pageNumber: [1],
      resultsPerPage: [10]
    });
  }

  ngOnInit(): void {
    if (history.state.searchFormData && history.state.articles) {
      this.searchForm.patchValue(history.state.searchFormData);
      this.articles = history.state.articles;
      this.totalResults = history.state.totalResults || this.articles.length;
      this.currentPage = history.state.currentPage || 1;
      this.formCollapsed = this.totalResults > 0;
    }
  }

  onSubmit(): void {
    this.articlesService.searchArticles(this.searchForm.value).subscribe({
      next: (response) => {
        this.articles = response.items;
        this.totalResults = response.totalResults;
        this.currentPage = response.pageNumber;
        this.formCollapsed = true;
      },
      error: (error) => {
        if (error.status === 404 && error.error.error === 'The search has given 0 results!') {
          this.articles = [];
          this.totalResults = 0;
          this.snackBar.open('No results found. Please try a different search.', 'Close', {
            duration: 5000,
          });

        } else if (error.status === 401) {
          this.snackBar.open('Session expired. Please log in again.', 'Close', {
            duration: 5000,
          });
          this.router.navigate(['/auth/login']);
        } else {
          console.error('Error fetching articles', error);
          this.snackBar.open('An error occurred during the search.', 'Close', {
            duration: 5000,
          });
        }
      },
    });
  }

  toggleForm(): void {
    this.formCollapsed = !this.formCollapsed;
  }

  goToPage(event: { pageNumber: number; pageSize: number }): void {
    this.searchForm.patchValue({
      pageNumber: event.pageNumber,
      resultsPerPage: event.pageSize
    });
    this.onSubmit();
  }
  

  onResultsPerPageChange(): void {
    this.searchForm.patchValue({
      pageNumber: 1
    });
    this.onSubmit();
  }
  
}
