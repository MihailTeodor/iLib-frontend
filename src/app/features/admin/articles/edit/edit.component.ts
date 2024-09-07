import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticlesService } from '../../../articles/articles.service';
import { ArticleDTO, ArticleState, ArticleType } from '../../../../shared/models/article.dto';
import { Router } from '@angular/router';
import { DateValidator } from '../../../../shared/validators/date.validator';
import { Location } from '@angular/common';


@Component({
  selector: 'app-edit-article',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditArticleComponent implements OnInit {
  editArticleForm: FormGroup;
  errorMessage: string | null = null;
  article: ArticleDTO | null = null;
  articleStates = Object.values(ArticleState);
  articleTypes = Object.values(ArticleType);

  constructor(
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private router: Router,
    private location: Location,
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
    // Pre-fill the form with article data
    if (history.state.article) {
      this.article = history.state.article;
      
      // Check if article is not null before patching
      if (this.article) {
        this.editArticleForm.patchValue(this.article);
      }
    } else {
      this.router.navigate(['/articles/search']);
    }
  }

  // Conditional display of fields
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
          console.log('Article updated successfully');

          // Redirect to the admin dashboard after successful update
          this.router.navigate(['/admin'], { state: { message: 'Article updated successfully' } });
        },
        error: (error) => {
          console.error('Error updating article', error);
          this.errorMessage = 'An error occurred while updating the article.';
        }
      });
    }
  }

  goBack(): void {
    this.location.back();  // Use the Location service to go back to the previous page
  }
}
