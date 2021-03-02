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

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() initQuery: string;
  @Input() initYear: string;
  @Input() initResultsMovies: TmdbResponse;
  @Input() initResultsShows: TmdbResponse;
  @ViewChild('searcherInput') searcherInput: ElementRef;

  query: string;
  year: string = '';
  numberOfMovies: number;
  numberOfShows: number;
  isMovie: boolean;
  isMovieSubscription: Subscription;

  constructor(
    private http: HttpService,
    private router: Router,
    private data: DataService
  ) {}

  ngOnChanges() {
    this.query = this.initQuery ? this.initQuery : '';
    this.year = this.initYear ? this.initYear : '';

    this.numberOfMovies = this.initResultsMovies
      ? this.initResultsMovies.total_results
      : null;
    this.numberOfShows = this.initResultsShows
      ? this.initResultsShows.total_results
      : null;
  }

  ngOnInit(): void {
    this.isMovieSubscription = this.data.currentMediaType.subscribe(
      (isMovie) => (this.isMovie = isMovie)
    );
  }

  ngOnDestroy() {
    this.isMovieSubscription.unsubscribe();
  }

  search() {
    this.http.getMovies(this.query, '1', this.year).subscribe(
      (res) => {
        this.numberOfMovies = res.total_results;
      },
      (error) => console.log('Błąd: ', error)
    );

    this.http.getShows(this.query, '1', this.year).subscribe(
      (res) => {
        this.numberOfShows = res.total_results;
      },
      (error) => console.log('Błąd: ', error)
    );

    this.router.navigate(['/results-movies', this.query, '1', this.year]);
  }

  changeMediaType(isMovie: boolean) {
    this.data.changeMediaType(isMovie);
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

  print(ngForm) {
    console.log(ngForm);
  }
}
