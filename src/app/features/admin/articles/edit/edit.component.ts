import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticlesService } from '../../../articles/articles.service';
import { ArticleDTO, ArticleState, ArticleType } from '../../../../shared/models/article.dto';
import { Router } from '@angular/router';
import { DateValidator } from '../../../../shared/validators/date.validator';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditArticleComponent implements OnInit {
  editArticleForm: FormGroup;
  article: ArticleDTO | null = null;
  articleStates = Object.values(ArticleState);
  articleTypes = Object.values(ArticleType);
  startYear = new Date();

  constructor(
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private router: Router,
    private location: Location,
    private snackBar: MatSnackBar
  ) {
    this.editArticleForm = this.fb.group({
      type: ['', Validators.required],
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
  }

  ngOnInit(): void {
    if (history.state.article) {
      this.article = history.state.article;

      if (this.article) {
        this.editArticleForm.patchValue(this.article);
        this.onTypeChange(); // Adjust validators based on type
      }
    } else {
      this.router.navigate(['/articles/search']);
    }
  }

  onTypeChange(): void {
    const selectedType = this.editArticleForm.get('type')?.value;

    if (selectedType === ArticleType.BOOK) {
      this.editArticleForm.get('author')?.setValidators(Validators.required);
      this.editArticleForm.get('isbn')?.setValidators(Validators.required);
      this.editArticleForm.get('issueNumber')?.clearValidators();
      this.editArticleForm.get('issn')?.clearValidators();
      this.editArticleForm.get('director')?.clearValidators();
      this.editArticleForm.get('isan')?.clearValidators();
    } else if (selectedType === ArticleType.MAGAZINE) {
      this.editArticleForm.get('issueNumber')?.setValidators(Validators.required);
      this.editArticleForm.get('issn')?.setValidators(Validators.required);
      this.editArticleForm.get('author')?.clearValidators();
      this.editArticleForm.get('isbn')?.clearValidators();
      this.editArticleForm.get('director')?.clearValidators();
      this.editArticleForm.get('isan')?.clearValidators();
    } else if (selectedType === ArticleType.DVD) {
      this.editArticleForm.get('director')?.setValidators(Validators.required);
      this.editArticleForm.get('isan')?.setValidators(Validators.required);
      this.editArticleForm.get('author')?.clearValidators();
      this.editArticleForm.get('isbn')?.clearValidators();
      this.editArticleForm.get('issueNumber')?.clearValidators();
      this.editArticleForm.get('issn')?.clearValidators();
    }

    this.editArticleForm.get('author')?.updateValueAndValidity();
    this.editArticleForm.get('isbn')?.updateValueAndValidity();
    this.editArticleForm.get('issueNumber')?.updateValueAndValidity();
    this.editArticleForm.get('issn')?.updateValueAndValidity();
    this.editArticleForm.get('director')?.updateValueAndValidity();
    this.editArticleForm.get('isan')?.updateValueAndValidity();
  }

  showBookFields(): boolean {
    return this.editArticleForm.get('type')?.value === ArticleType.BOOK;
  }

  showMagazineFields(): boolean {
    return this.editArticleForm.get('type')?.value === ArticleType.MAGAZINE;
  }

  showMovieDvdFields(): boolean {
    return this.editArticleForm.get('type')?.value === ArticleType.DVD;
  }

  onSubmit(): void {
    if (this.editArticleForm.valid && this.article) {
      const updatedArticle: ArticleDTO = { ...this.article, ...this.editArticleForm.value };

      this.articlesService.updateArticle(updatedArticle).subscribe({
        next: () => {
          this.snackBar.open('Article updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin'], { state: { message: 'Article updated successfully' } });
        },
        error: (error) => {
          if (error.status === 401) {
            this.snackBar.open('Session expired. Please log in again.', 'Close', {
              duration: 5000,
            });
            this.router.navigate(['/auth/login']);
          }
          console.error('Error updating article', error);
          this.snackBar.open('An error occurred while updating the article.', 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
