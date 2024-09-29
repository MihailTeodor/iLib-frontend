import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  message: string | null = null;

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (history.state.message) {
      this.message = history.state.message;

      this.snackBar.open(this.message!, 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    }
  }
}
