import { HttpService } from 'src/app/services/http.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  query: string;
  numberOfMovies: number;
  numberOfShows: number;

  constructor(private http: HttpService, private router: Router) {}

  ngOnInit() {
    this.query = sessionStorage.getItem('query');
    this.numberOfMovies = Number(sessionStorage.getItem('numberOfMovies'));
    this.numberOfShows = Number(sessionStorage.getItem('numberOfShows'));
  }

  search() {
    sessionStorage.clear();
    sessionStorage.setItem('query', this.query);
    this.http.getMovies(this.query).subscribe(
      (res) => {
        this.numberOfMovies = res.total_results;
        sessionStorage.setItem(
          'numberOfMovies',
          this.numberOfMovies.toString()
        );
      },
      (error) => console.log('Błąd: ', error)
    );
    this.http.getShows(this.query).subscribe(
      (res) => {
        this.numberOfShows = res.total_results;
        sessionStorage.setItem('numberOfShows', this.numberOfShows.toString());
      },
      (error) => console.log('Błąd: ', error)
    );

    this.router.navigate(['/results-movies', this.query, '1']);
  }

  reset(): void {
    this.query = null;
    this.numberOfMovies = null;
    this.numberOfShows = null;
    sessionStorage.clear();
  }
}
