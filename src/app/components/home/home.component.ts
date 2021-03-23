import { DataService } from './../../services/data.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TmdbResponse } from 'src/app/models/tmdb-response';
import { HttpService } from 'src/app/services/http.service';
import { SeoService } from 'src/app/services/seo.service';
import { MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  movies: TmdbResponse;
  shows: TmdbResponse;
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
    this.http.getPopularMovies().subscribe((res) => (this.movies = res));
    this.http.getPopularShows().subscribe((res) => (this.shows = res));
    setTimeout(() => {
      this.data.setBackdropPath(this.defaultBackdropPath);
    }, 0);
  }

  setMetaTags() {
    this.seo.setMetaTitle('Filmoteka | filmy i seriale');

    const tags: MetaDefinition[] = [
      {
        name: 'description',
        content: 'Informacje o filmach, serialach, ich twórcach i aktorach',
      },
      { property: 'og:title', content: 'Filmoteka | filmy i seriale' },
      {
        property: 'og:description',
        content: 'Informacje o filmach, serialach, ich twórcach i aktorach',
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
