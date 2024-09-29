import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './list/list.component';
import { UserDetailComponent } from './detail/detail.component';
import { UserDashboardComponent } from './dashboard/dashboard.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';





@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserDashboardComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  exports: [
    UserListComponent
  ]
})
export class UsersModule { }
