import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchArticlesComponent } from './search/search.component';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleListComponent } from './list/list.component';
import { ArticleDetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [SearchArticlesComponent, ArticleListComponent, ArticleDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ArticlesRoutingModule
  ]
})
export class ArticlesModule { }
