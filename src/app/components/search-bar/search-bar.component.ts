import { TmdbResponse } from 'src/app/models/tmdb-response';
import { HttpService } from 'src/app/services/http.service';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent implements OnInit, OnChanges {
  @Input() initQuery: string;
  @Input() initResultsMovies: TmdbResponse;
  @Input() initResultsShows: TmdbResponse;
  @ViewChild('searcherInput') searcherInput: ElementRef;

  query: string;
  numberOfMovies: number;
  numberOfShows: number;

  constructor(private http: HttpService, private router: Router) {}

  ngOnChanges() {
    this.query = this.initQuery ? this.initQuery : null;
    this.numberOfMovies = this.initResultsMovies
      ? this.initResultsMovies.total_results
      : null;
    this.numberOfShows = this.initResultsShows
      ? this.initResultsShows.total_results
      : null;
  }

  ngOnInit(): void {}

  search() {
    this.http.getMovies(this.query).subscribe(
      (res) => {
        this.numberOfMovies = res.total_results;
      },
      (error) => console.log('Błąd: ', error)
    );

    this.http.getShows(this.query).subscribe(
      (res) => {
        this.numberOfShows = res.total_results;
      },
      (error) => console.log('Błąd: ', error)
    );

    this.router.navigate(['/results-movies', this.query, '1']);
  }

  cancel(): void {
    this.query = '';
    setTimeout(() => {
      this.searcherInput.nativeElement.focus();
    }, 0);
  }
}
