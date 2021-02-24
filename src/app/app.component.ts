import { TmdbResponse } from 'src/app/models/tmdb-response';
import { HttpService } from 'src/app/services/http.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  initQuery: string;
  initResultsMovies: TmdbResponse;
  initResultsShows: TmdbResponse;

  backdropPath: string;
  backdropPathSubscription: Subscription;

  constructor(
    private http: HttpService,
    private location: Location,
    private data: DataService
  ) {}

  ngOnInit() {
    console.log('ng onInit');
    this.getInitialParameters();
    this.backdropPathSubscription = this.data.currentBackdropPath.subscribe(
      (path) => {
        this.backdropPath = path;
      }
    );
  }

  ngOnDestroy() {
    this.backdropPathSubscription.unsubscribe();
  }

  getInitialParameters() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (
      initialParameters[1] === 'results-movies' ||
      initialParameters[1] === 'results-shows'
    ) {
      this.initQuery = initialParameters[2];

      this.http.getMovies(this.initQuery).subscribe(
        (res) => {
          this.initResultsMovies = res;
        },
        (error) => console.log('Błąd: ', error)
      );

      this.http.getShows(this.initQuery).subscribe(
        (res) => {
          this.initResultsShows = res;
        },
        (error) => console.log('Błąd: ', error)
      );
    }
  }

  setBackgroundStyle() {
    if (this.backdropPath && this.backdropPath !== 'blank') {
      return {
        'background-image': `linear-gradient(rgba(255, 255, 255,0.9),rgba(255, 255, 255,0.8)),
          url(${this.backdropPath})`,
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': '50% 0%',
        'background-attachment': 'fixed',
      };
    } else {
      return {
        'background-color': '#fff',
      };
    }
  }

  reset() {
    this.initQuery = '';
    this.initResultsMovies = null;
    this.initResultsShows = null;
  }
}
