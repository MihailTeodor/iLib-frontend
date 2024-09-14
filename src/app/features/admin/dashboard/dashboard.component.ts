import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  message: string | null = null;
  showMessage: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (history.state.message) {
      this.message = history.state.message;
      this.showMessage = true;

      setTimeout(() => {
        this.showMessage = false;
      }, 1000);
    }
  }

  closeMessage(): void {
    this.showMessage = false;
  }
}
