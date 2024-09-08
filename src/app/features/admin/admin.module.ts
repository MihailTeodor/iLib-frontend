import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddArticleComponent } from './articles/add/add.component';
import { EditArticleComponent } from './articles/edit/edit.component';
import { RegisterUserComponent } from './users/register/register.component';

@NgModule({
  declarations: [DashboardComponent, AddArticleComponent, EditArticleComponent, RegisterUserComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
