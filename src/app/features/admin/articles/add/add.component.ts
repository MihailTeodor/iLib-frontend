import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticlesService } from '../../../articles/articles.service';
import { ArticleDTO, ArticleState, ArticleType } from '../../../../shared/models/article.dto';
import { DateValidator } from '../../../../shared/validators/date.validator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-article',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddArticleComponent {
  addArticleForm: FormGroup;
  articleStates = Object.values(ArticleState);
  articleTypes = Object.values(ArticleType);
  startYear = new Date();

  constructor(
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.addArticleForm = this.fb.group({
      type: [ArticleType.BOOK, Validators.required],
      title: ['', Validators.required],
      author: [''],
      location: ['', Validators.required],
      yearEdition: ['', [Validators.required, DateValidator.pastOrPresent()]],
      publisher: ['', Validators.required],
      genre: ['', Validators.required],
      isbn: [''],
      issueNumber: [null],
      issn: [''],
      director: [''],
      isan: [''],
      state: [ArticleState.AVAILABLE],
      description: ['']
    });
    this.onTypeChange();
  }

  onTypeChange(): void {
    const selectedType = this.addArticleForm.get('type')?.value;

    if (selectedType === ArticleType.BOOK) {
      this.addArticleForm.get('author')?.setValidators(Validators.required);
      this.addArticleForm.get('isbn')?.setValidators(Validators.required);
      this.addArticleForm.get('issueNumber')?.clearValidators();
      this.addArticleForm.get('issn')?.clearValidators();
      this.addArticleForm.get('director')?.clearValidators();
      this.addArticleForm.get('isan')?.clearValidators();
    } else if (selectedType === ArticleType.MAGAZINE) {
      this.addArticleForm.get('issueNumber')?.setValidators(Validators.required);
      this.addArticleForm.get('issn')?.setValidators(Validators.required);
      this.addArticleForm.get('author')?.clearValidators();
      this.addArticleForm.get('isbn')?.clearValidators();
      this.addArticleForm.get('director')?.clearValidators();
      this.addArticleForm.get('isan')?.clearValidators();
    } else if (selectedType === ArticleType.DVD) {
      this.addArticleForm.get('director')?.setValidators(Validators.required);
      this.addArticleForm.get('isan')?.setValidators(Validators.required);
      this.addArticleForm.get('author')?.clearValidators();
      this.addArticleForm.get('isbn')?.clearValidators();
      this.addArticleForm.get('issueNumber')?.clearValidators();
      this.addArticleForm.get('issn')?.clearValidators();
    }

    this.addArticleForm.get('author')?.updateValueAndValidity();
    this.addArticleForm.get('isbn')?.updateValueAndValidity();
    this.addArticleForm.get('issueNumber')?.updateValueAndValidity();
    this.addArticleForm.get('issn')?.updateValueAndValidity();
    this.addArticleForm.get('director')?.updateValueAndValidity();
    this.addArticleForm.get('isan')?.updateValueAndValidity();

    this.addArticleForm.get('author')?.reset();
    this.addArticleForm.get('isbn')?.reset();
    this.addArticleForm.get('issueNumber')?.reset();
    this.addArticleForm.get('issn')?.reset();
    this.addArticleForm.get('director')?.reset();
    this.addArticleForm.get('isan')?.reset();
  }

  showBookFields(): boolean {
    return this.addArticleForm.get('type')?.value === ArticleType.BOOK;
  }

  showMagazineFields(): boolean {
    return this.addArticleForm.get('type')?.value === ArticleType.MAGAZINE;
  }

  showMovieDvdFields(): boolean {
    return this.addArticleForm.get('type')?.value === ArticleType.DVD;
  }

  onSubmit(): void {
    if (this.addArticleForm.valid) {
      const newArticle: ArticleDTO = this.addArticleForm.value;
      this.articlesService.addArticle(newArticle).subscribe({
        next: () => {
          this.snackBar.open('Article added successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin'], { state: { message: 'Article added successfully' } });
        },
        error: (error) => {
          if (error.status === 401) {
            this.snackBar.open('Session expired. Please log in again.', 'Close', {
              duration: 5000,
            });
            this.router.navigate(['/auth/login']);
          }
          console.error('Error adding article', error);
          this.snackBar.open(error.error.error, 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }
}
