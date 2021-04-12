import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TmdbResponse } from 'src/app/models/tmdb-response';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { SeoService } from 'src/app/services/seo.service';
import { MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResultsComponent implements OnInit {
  isMovie: boolean;
  query: string;
  year: string = '';
  movies: TmdbResponse;
  shows: TmdbResponse;
  urlImg150: string;
  urlImg130: string;
  urlImg94: string;
  defaultBackdropPath: string;

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
    private seo: SeoService,
    private paginatorLabels: MatPaginatorIntl
  ) {
    this.urlImg150 = this.http.urlImg150;
    this.urlImg130 = this.http.urlImg130;
    this.urlImg94 = this.http.urlImg94;
    this.defaultBackdropPath = this.data.defaultBackdropPath;
  }

  ngOnInit(): void {
    this.switchMoviesOrShows();
    this.setMetaTags();
    this.paginatorLabels.nextPageLabel = 'Następna strona';
    this.paginatorLabels.previousPageLabel = 'Poprzednia strona';
    this.paginatorLabels.firstPageLabel = 'Pierwsza strona';
    this.paginatorLabels.lastPageLabel = 'Ostatnia strona';
    this.paginatorLabels.getRangeLabel = this.paginatorPolishRangeLabel;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.query = params.get('query');
      this.year = params.get('year') ? params.get('year') : '';

      this.getData(params.get('query'), params.get('page'), params.get('year'));

      this.setPaginatorPage(params.get('page'));
    });

    setTimeout(() => {
      this.data.setBackdropPath(this.defaultBackdropPath);
    }, 0);
  }

  getData(query: string, page: string = '1', year: string = '') {
    if (this.isMovie) {
      this.http
        .getMovies(query, page, year)
        .toPromise()
        .then((res) => {
          this.movies = res;
          this.length = res.total_results;
          // console.log('http movies: ', this.movies);
        })
        .catch((error) => {
          console.log(error);
          this.router.navigate([`/page-not-found/${error.status}`], {
            state: {
              serverStatus: error.status,
              apiStatus: error.error.status_code,
              apiMessage: error.error.status_message,
            },
          });
        });
    } else {
      this.http
        .getShows(query, page, year)
        .toPromise()
        .then((res) => {
          this.shows = res;
          this.length = res.total_results;
          // console.log('http shows: ', this.shows);
        })
        .catch((error) => {
          console.log(error);
          this.router.navigate([`/page-not-found/${error.status}`], {
            state: {
              serverStatus: error.status,
              apiStatus: error.error.status_code,
              apiMessage: error.error.status_message,
            },
          });
        });
    }
  }

  setMetaTags() {
    this.seo.setMetaTitle('Filmoteka | filmy i seriale');

    const tags: MetaDefinition[] = [
      {
        name: 'description',
        content:
          'Informacje o filmach, serialach, ich twórcach i aktorach, kodi nfo generator',
      },
      { property: 'og:title', content: 'Filmoteka | filmy i seriale' },
      {
        property: 'og:description',
        content:
          'Informacje o filmach, serialach, ich twórcach i aktorach, kodi nfo generator',
      },
      {
        property: 'og:image',
        content: 'https://filmy.pewube.eu/filmoteka-ogi.png',
      },
      { property: 'og:url', content: 'https://filmy.pewube.eu/' },
    ];
    this.seo.setMetaTags(tags);
  }

  switchMoviesOrShows(): void {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (initialParameters[1] === 'results-movies') {
      this.isMovie = true;
      this.data.isMovie = true;
    } else {
      this.isMovie = false;
      this.data.isMovie = false;
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
    if (this.isMovie) {
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
