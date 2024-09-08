import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchArticlesComponent } from '../articles/search/search.component';
import { AddArticleComponent } from './articles/add/add.component';
import { EditArticleComponent } from './articles/edit/edit.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RegisterUserComponent } from './users/register/register.component';
import { SearchUsersComponent } from './users/search/search.component';
import { EditUserComponent } from './users/edit/edit.component';


const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard], data: { role: 'ADMINISTRATOR' } },
  { path: 'articles/search', component: SearchArticlesComponent },
  { path: 'articles/add', component: AddArticleComponent, canActivate: [AuthGuard], data: { role: 'ADMINISTRATOR' } },
  { path: 'articles/edit/:id', component: EditArticleComponent, canActivate: [AuthGuard], data: { role: 'ADMINISTRATOR' } },
  { path: 'users/register', component: RegisterUserComponent, canActivate: [AuthGuard], data: { role: 'ADMINISTRATOR' } },
  { path: 'users/search', component: SearchUsersComponent, canActivate: [AuthGuard], data: { role: 'ADMINISTRATOR' } },
  { path: 'users/edit/:id', component: EditUserComponent, canActivate: [AuthGuard], data: { role: 'ADMINISTRATOR' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
