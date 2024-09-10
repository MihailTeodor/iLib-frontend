import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './list/list.component';
import { UserDetailComponent } from './detail/detail.component';
import { UserDashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserDashboardComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule
  ],
  exports: [
    UserListComponent
  ]
})
export class UsersModule { }
