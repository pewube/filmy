import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TmdbResponse } from 'src/app/models/tmdb-response';
import {
  PageEvent,
  MatPaginatorIntl,
  MatPaginator,
} from '@angular/material/paginator';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  //paginator settings
  lengthMovies: number;
  pageSizeMovies: number = 20;
  pageIndexMovies: number;
  lengthShows: number;
  pageSizeShows: number = 20;
  pageIndexShows: number;
  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;

  query: string;
  movies: TmdbResponse;
  shows: TmdbResponse;

  urlImg94: string = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2';

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private paginatorLabels: MatPaginatorIntl
  ) {
    this.paginatorLabels.nextPageLabel = 'Następna strona';
    this.paginatorLabels.previousPageLabel = 'Poprzednia strona';
    this.paginatorLabels.firstPageLabel = 'Pierwsza strona';
    this.paginatorLabels.lastPageLabel = 'Ostatnia strona';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.http.getMovies(params.get('query')).subscribe(
        (res) => {
          this.movies = res;
          this.lengthMovies = res.total_results;
          console.log('Filmy z ngOnInit: ', this.movies);
        },
        (error) => console.log('Błąd: ', error)
      );
      this.http.getShows(params.get('query')).subscribe(
        (res) => {
          this.shows = res;
          this.lengthShows = res.total_results;
          console.log('Seriale z ngOnInit: ', this.shows);
        },
        (error) => console.log('Błąd: ', error)
      );
      // paginators reset
      if (this.paginators) {
        this.paginators.forEach((paginator) => {
          console.log(paginator);
          paginator.firstPage();
        });
      }
    });
  }

  changePageMovies(event: PageEvent) {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.http
          .getMovies(params.get('query'), (event.pageIndex + 1).toString())
          .subscribe(
            (res) => {
              this.movies = res;
              this.lengthMovies = res.total_results;
              console.log('Filmy z changePageMovies: ', this.movies);
            },
            (error) => console.log('Błąd: ', error)
          );
        console.log('params z changePageMovies', params);
      })
      .unsubscribe();
  }
  changePageShows(event: PageEvent) {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.http
          .getShows(params.get('query'), (event.pageIndex + 1).toString())
          .subscribe(
            (res) => {
              this.shows = res;
              this.lengthShows = res.total_results;
              console.log('Seriale z changePageShows: ', this.shows);
            },
            (error) => console.log('Błąd: ', error)
          );
        console.log('params z changePageShows', params);
      })
      .unsubscribe();
  }
}
