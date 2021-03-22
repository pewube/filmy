import { TmdbResponse } from 'src/app/models/tmdb-response';
import { HttpService } from 'src/app/services/http.service';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('searcherInput') searcherInput: ElementRef;
  @Input() isReset: boolean = false;
  query: string;
  page: string;
  year: string = '';
  numberOfMovies: number;
  numberOfShows: number;

  isMovie: boolean;
  isMovieSubscription: Subscription;

  constructor(
    private http: HttpService,
    private router: Router,
    private data: DataService,
    private location: Location
  ) {}

  ngOnChanges() {
    if (this.isReset) {
      this.resetData();
    }
  }

  ngOnInit(): void {
    this.isMovieSubscription = this.data
      .getIsMovie()
      .subscribe((isMovie) => (this.isMovie = isMovie));
    this.getInitialData();
  }

  ngOnDestroy() {
    this.isMovieSubscription.unsubscribe();
  }

  getInitialData() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (
      initialParameters[1] === 'results-movies' ||
      initialParameters[1] === 'results-shows'
    ) {
      this.query = decodeURIComponent(initialParameters[2]);
      this.page = initialParameters[3];
      this.year = initialParameters[4] ? initialParameters[4] : '';

      this.http
        .getMovies(this.query, this.page, this.year)
        .toPromise()
        .then((res) => {
          this.numberOfMovies = res.total_results;
        })
        .catch((error) => console.log(error));

      this.http
        .getShows(this.query, this.page, this.year)
        .toPromise()
        .then((res) => {
          this.numberOfShows = res.total_results;
        })
        .catch((error) => console.log(error));
    }
  }

  resetData() {
    this.query = '';
    this.page = '';
    this.year = '';
    this.numberOfMovies = null;
    this.numberOfShows = null;
  }

  async search() {
    this.query = this.query.replace(/\./g, ' ');

    const movies: TmdbResponse = await this.http
      .getMovies(this.query, '1', this.year)
      .toPromise();

    this.numberOfMovies = movies.total_results;

    const shows: TmdbResponse = await this.http
      .getShows(this.query, '1', this.year)
      .toPromise();

    this.numberOfShows = shows.total_results;

    if (this.numberOfShows > this.numberOfMovies) {
      this.setIsMovie(false);
      this.router.navigate(['/results-shows', this.query, '1', this.year]);
    } else {
      this.setIsMovie(true);
      this.router.navigate(['/results-movies', this.query, '1', this.year]);
    }
  }

  setIsMovie(isMovie: boolean) {
    this.data.setIsMovie(isMovie);
  }

  cancelQuery(): void {
    this.query = '';
    this.numberOfMovies = null;
    this.numberOfShows = null;

    setTimeout(() => {
      this.searcherInput.nativeElement.focus();
    }, 0);
  }
  cancelYear(): void {
    this.year = '';
    this.numberOfMovies = null;
    this.numberOfShows = null;
  }
}
