import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddArticleComponent } from './articles/add/add.component';
import { EditArticleComponent } from './articles/edit/edit.component';
import { RegisterUserComponent } from './users/register/register.component';
import { SearchUsersComponent } from './users/search/search.component';
import { UsersModule } from '../../features/users/users.module';

@NgModule({
  declarations: [DashboardComponent, AddArticleComponent, EditArticleComponent, RegisterUserComponent, SearchUsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UsersModule
  ]
})
export class AdminModule { }
