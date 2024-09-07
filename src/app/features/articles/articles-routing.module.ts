import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchArticlesComponent } from './search/search.component';
import { ArticleDetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: 'search', component: SearchArticlesComponent },
  { path: 'details/:id', component: ArticleDetailComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
