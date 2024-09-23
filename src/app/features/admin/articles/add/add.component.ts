import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticlesService } from '../../../articles/articles.service';
import { ArticleDTO, ArticleState, ArticleType } from '../../../../shared/models/article.dto';
import { DateValidator } from '../../../../shared/validators/date.validator';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-add-article',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddArticleComponent {
  addArticleForm: FormGroup;
  errorMessage: string | null = null;

  articleStates = Object.values(ArticleState);
  articleTypes = Object.values(ArticleType);

  constructor(
    private fb: FormBuilder, 
    private articlesService: ArticlesService,
    private router: Router,  
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
  }


  onTypeChange(): void {
    const selectedType = this.addArticleForm.get('type')?.value;

    if (selectedType === ArticleType.BOOK) {
      this.addArticleForm.get('issueNumber')?.reset();
      this.addArticleForm.get('issn')?.reset();
      this.addArticleForm.get('director')?.reset();
      this.addArticleForm.get('isan')?.reset();
    } else if (selectedType === ArticleType.MAGAZINE) {
      this.addArticleForm.get('author')?.reset();
      this.addArticleForm.get('isbn')?.reset();
      this.addArticleForm.get('director')?.reset();
      this.addArticleForm.get('isan')?.reset();
    } else if (selectedType === ArticleType.DVD) {
      this.addArticleForm.get('author')?.reset();
      this.addArticleForm.get('isbn')?.reset();
      this.addArticleForm.get('issueNumber')?.reset();
      this.addArticleForm.get('issn')?.reset();
    }
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
          console.log('Article added successfully');
          this.router.navigate(['/admin'], { state: { message: 'Article added successfully' } });

        },
        error: (error) => {
          console.error('Error adding article', error);
          this.errorMessage = 'An error occurred while adding the article.';
        }
      });
    }
  }
}
