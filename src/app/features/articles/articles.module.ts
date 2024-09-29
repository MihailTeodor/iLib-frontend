import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchArticlesComponent } from './search/search.component';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleListComponent } from './list/list.component';
import { ArticleDetailComponent } from './detail/detail.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [SearchArticlesComponent, ArticleListComponent, ArticleDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ArticlesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,

  ]
})
export class ArticlesModule { }
