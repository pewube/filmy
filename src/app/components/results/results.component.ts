import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TmdbResponse } from 'src/app/models/tmdb-response';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Location } from '@angular/common';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  movieFlag: boolean;
  query: string;
  movies: TmdbResponse;
  shows: TmdbResponse;
  urlImg150: string;
  urlImg130: string;
  urlImg94: string;

  //paginator settings
  length: number;
  pageSize: number = 20;
  pageIndex: number;
  //====

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private location: Location,
    private paginatorLabels: MatPaginatorIntl
  ) {
    this.paginatorLabels.nextPageLabel = 'Następna strona';
    this.paginatorLabels.previousPageLabel = 'Poprzednia strona';
    this.paginatorLabels.firstPageLabel = 'Pierwsza strona';
    this.paginatorLabels.lastPageLabel = 'Ostatnia strona';
    this.urlImg150 = this.http.urlImg150;
    this.urlImg130 = this.http.urlImg130;
    this.urlImg94 = this.http.urlImg94;
  }

  ngOnInit(): void {
    this.switchData();

    if (this.movieFlag) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.query = params.get('query');

        this.http.getMovies(params.get('query'), params.get('page')).subscribe(
          (res) => {
            this.movies = res;
            this.length = res.total_results;
            console.log('Filmy z ngOnInit: ', this.movies);

            // If number of films is 0 show tvshows results
            if (this.length === 0) {
              this.router.navigate(['/results-shows', this.query, '1']);
            }
          },
          (error) => console.log('Błąd: ', error)
        );

        this.pageIndex = Number(params.get('page')) - 1;
      });
    } else {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.query = params.get('query');

        this.http.getShows(params.get('query'), params.get('page')).subscribe(
          (res) => {
            this.shows = res;
            this.length = res.total_results;
            console.log('Seriale z ngOnInit: ', this.shows);
          },
          (error) => console.log('Błąd: ', error)
        );

        this.pageIndex = Number(params.get('page')) - 1;
      });
    }
  }

  switchData() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (initialParameters[1] === 'results-movies') {
      this.movieFlag = true;
    } else {
      this.movieFlag = false;
    }
  }

  changePage(event: PageEvent): void {
    if (this.movieFlag) {
      this.router.navigate([
        '/results-movies',
        this.query,
        (event.pageIndex + 1).toString(),
      ]);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      this.router.navigate([
        '/results-shows',
        this.query,
        (event.pageIndex + 1).toString(),
      ]);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
}
