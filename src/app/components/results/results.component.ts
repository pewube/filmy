import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TmdbResponse } from 'src/app/models/tmdb-response';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResultsComponent implements OnInit {
  movieFlag: boolean;
  query: string;
  year: string = '';
  movies: TmdbResponse;
  shows: TmdbResponse;
  urlImg150: string;
  urlImg130: string;
  urlImg94: string;

  //paginator settings
  length: number;
  pageSize = 20;
  pageIndex: number;
  //====

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private location: Location,
    private data: DataService,
    private paginatorLabels: MatPaginatorIntl
  ) {
    this.urlImg150 = this.http.urlImg150;
    this.urlImg130 = this.http.urlImg130;
    this.urlImg94 = this.http.urlImg94;
  }

  ngOnInit(): void {
    this.switchMoviesOrShows();
    this.paginatorLabels.nextPageLabel = 'Następna strona';
    this.paginatorLabels.previousPageLabel = 'Poprzednia strona';
    this.paginatorLabels.firstPageLabel = 'Pierwsza strona';
    this.paginatorLabels.lastPageLabel = 'Ostatnia strona';
    this.paginatorLabels.getRangeLabel = this.paginatorPolishRangeLabel;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.query = params.get('query');
      this.year = params.get('year') ? params.get('year') : '';

      if (this.movieFlag) {
        this.http
          .getMovies(
            params.get('query'),
            params.get('page'),
            params.get('year')
          )
          .subscribe(
            (res) => {
              this.movies = res;
              this.length = res.total_results;
              // console.log('http movies: ', this.movies);
              if (res.total_results === 0) {
                this.router.navigate([
                  '/results-shows',
                  this.query,
                  1,
                  this.year,
                ]);
              }
            },
            (error) => {
              console.log(error);
              this.router.navigate([`/page-not-found/${error.status}`], {
                state: {
                  serverStatus: error.status,
                  apiStatus: error.error.status_code,
                  apiMessage: error.error.status_message,
                },
              });
            }
          );

        this.setPaginatorPage(params.get('page'));
      } else {
        this.http
          .getShows(params.get('query'), params.get('page'), params.get('year'))
          .subscribe(
            (res) => {
              this.shows = res;
              this.length = res.total_results;
              // console.log('http shows: ', this.shows);
            },
            (error) => {
              console.log(error);
              this.router.navigate([`/page-not-found/${error.status}`], {
                state: {
                  serverStatus: error.status,
                  apiStatus: error.error.status_code,
                  apiMessage: error.error.status_message,
                },
              });
            }
          );

        this.setPaginatorPage(params.get('page'));
      }
    });
  }

  switchMoviesOrShows(): void {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (initialParameters[1] === 'results-movies') {
      this.movieFlag = true;
      this.data.changeMediaType(true);
    } else {
      this.movieFlag = false;
      this.data.changeMediaType(false);
    }
  }

  setPaginatorPage(page: string) {
    this.pageIndex = Number(page) - 1;
  }

  paginatorPolishRangeLabel(
    pageIndex: number,
    pageSize: number,
    length: number
  ) {
    const startIndex = pageIndex * pageSize;
    const endIndex = (pageIndex + 1) * pageSize;
    return `${startIndex + 1} - ${
      endIndex < length ? endIndex : length
    } z ${length}`;
  }

  changePage(event: PageEvent): void {
    if (this.movieFlag) {
      this.router.navigate([
        '/results-movies',
        this.query,
        (event.pageIndex + 1).toString(),
        this.year,
      ]);
      window.scrollTo(0, 0);
    } else {
      this.router.navigate([
        '/results-shows',
        this.query,
        (event.pageIndex + 1).toString(),
        this.year,
      ]);
      window.scrollTo(0, 0);
    }
  }
}
