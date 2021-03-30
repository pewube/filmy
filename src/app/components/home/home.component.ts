import { DataService } from './../../services/data.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TmdbResponse } from 'src/app/models/tmdb-response';
import { HttpService } from 'src/app/services/http.service';
import { SeoService } from 'src/app/services/seo.service';
import { MetaDefinition } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  movies: TmdbResponse;
  moviesSubscription: Subscription;
  localMovies: TmdbResponse;
  shows: TmdbResponse;
  showsSubscription: Subscription;
  localShows: TmdbResponse;
  urlImg150: string;
  defaultBackdropPath: string;

  constructor(
    private http: HttpService,
    private data: DataService,
    private seo: SeoService
  ) {
    this.urlImg150 = this.http.urlImg150;
    this.defaultBackdropPath = this.data.defaultBackdropPath;
  }

  ngOnInit(): void {
    this.setMetaTags();

    this.moviesSubscription = this.data
      .getPopularMovies()
      .subscribe((localMovies) => {
        this.localMovies = localMovies;
      });

    this.showsSubscription = this.data
      .getPopularShows()
      .subscribe((localShows) => {
        this.localShows = localShows;
      });

    this.getData();

    setTimeout(() => {
      this.data.setBackdropPath(this.defaultBackdropPath);
    }, 0);
  }

  ngOnDestroy(): void {
    this.moviesSubscription.unsubscribe();
    this.showsSubscription.unsubscribe();
  }

  getData() {
    if (this.localMovies) {
      this.movies = this.localMovies;
    } else {
      this.http.getPopularMovies().subscribe((res) => {
        this.movies = res;
        this.data.setPopularMovies(this.movies);
      });
    }
    if (this.localShows) {
      this.shows = this.localShows;
    } else {
      this.http.getPopularShows().subscribe((res) => {
        this.shows = res;
        this.data.setPopularShows(this.shows);
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
}
