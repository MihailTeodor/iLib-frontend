import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArticlesService } from '../../../features/articles/articles.service';
import { ArticleDTO } from '../../../shared/models/article.dto';

@Component({
  selector: 'app-search-articles',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchArticlesComponent {
  searchForm: FormGroup;
  articles: ArticleDTO[] = [];
  errorMessage: string | null = null;
  totalResults: number = 0;
  totalPages: number = 1;
  currentPage: number = 1;
  formCollapsed: boolean = false;
  resultsPerPageOptions = [5, 10, 15, 20];

  constructor(private fb: FormBuilder, private articlesService: ArticlesService) {
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
      // Restore form data
      this.searchForm.patchValue(history.state.searchFormData);
  
      // Restore articles and results
      this.articles = history.state.articles;
      this.totalResults = this.articles.length;
      
      // Automatically collapse the form if results exist, otherwise expand it
      this.formCollapsed = this.totalResults > 0;
    }
  }
  
  
  onSubmit(): void {
    this.articlesService.searchArticles(this.searchForm.value).subscribe({
      next: (response) => {
        this.articles = response.items;
        this.totalResults = response.totalResults;
        this.totalPages = response.totalPages;
        this.currentPage = response.pageNumber;
        this.errorMessage = null;
        this.formCollapsed = true;
      },
      error: (error) => {
        if (error.status === 404 && error.error.error === 'The search has given 0 results!') {
          // Handle the case where no results were found
          this.articles = [];
          this.totalResults = 0;
          this.errorMessage = 'No results found. Please try a different search.';
        } else {
          // Handle other errors
          console.error('Error fetching articles', error);
          this.errorMessage = 'An error occurred during the search. Please try again.';
        }
      }
    });
  }

  toggleForm(): void {
    this.formCollapsed = !this.formCollapsed;
  }

  goToPage(pageNumber: number): void {
    this.searchForm.get('pageNumber')?.setValue(pageNumber);
    this.onSubmit();
  }

  onResultsPerPageChange(): void {
    this.searchForm.get('pageNumber')?.setValue(1);
  }
}
