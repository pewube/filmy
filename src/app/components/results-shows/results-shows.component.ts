import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TmdbResponse } from 'src/app/models/tmdb-response';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
@Component({
  selector: 'app-results-shows',
  templateUrl: './results-shows.component.html',
  styleUrls: ['./results-shows.component.scss'],
})
export class ResultsShowsComponent implements OnInit {
  //paginator settings
  length: number;
  pageSize: number = 20;
  pageIndex: number;

  query: string;
  shows: TmdbResponse;
  urlImg94: string = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  changePage(event: PageEvent) {
    this.router.navigate([
      '/results-shows',
      this.query,
      (event.pageIndex + 1).toString(),
    ]);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
}
