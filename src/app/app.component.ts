import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  query: string;

  constructor(private router: Router) {}

  showResults() {
    this.router.navigate(['/results', this.query]);
    this.query = '';
  }
}
