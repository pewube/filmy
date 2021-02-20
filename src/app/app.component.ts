import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  query: string;
  numberOfMovies: number;
  numberOfShows: number;

  constructor(
    private http: HttpService,
    private router: Router,
    private location: Location,
    private localData: DataService
  ) {}

  ngOnInit() {
    this.getTabBarData();
    console.log('init app');
  }

  search() {
    this.localData.setQuery(this.query);

    this.http.getMovies(this.query).subscribe(
      (res) => {
        this.numberOfMovies = res.total_results;
        this.localData.setResultMovies(res);
      },
      (error) => console.log('Błąd: ', error)
    );

    this.http.getShows(this.query).subscribe(
      (res) => {
        this.numberOfShows = res.total_results;
        this.localData.setResultShows(res);
      },
      (error) => console.log('Błąd: ', error)
    );

    this.router.navigate(['/results-movies', this.query, '1']);
  }

  getTabBarData() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (
      initialParameters[1] === 'results-movies' ||
      initialParameters[1] === 'results-shows'
    ) {
      this.query = initialParameters[2];
      this.localData.setQuery(this.query);
      this.http.getMovies(this.query).subscribe(
        (res) => {
          this.numberOfMovies = res.total_results;
          this.localData.setResultMovies(res);
        },
        (error) => console.log('Błąd: ', error)
      );
      this.http.getShows(this.query).subscribe(
        (res) => {
          this.numberOfShows = res.total_results;
          this.localData.setResultShows(res);
        },
        (error) => console.log('Błąd: ', error)
      );
    } else {
      this.query = null;
    }
  }

  reset(): void {
    this.query = null;
    this.numberOfMovies = null;
    this.numberOfShows = null;
  }
  cancel(): void {
    this.router.navigate(['/']);
    this.query = null;
    this.numberOfMovies = null;
    this.numberOfShows = null;
  }
}
