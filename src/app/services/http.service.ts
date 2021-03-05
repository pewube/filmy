import { TmdbResponse } from './../models/tmdb-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { VideoDetails } from '../models/video-details';
import { ConfigService } from './config.service';
import { Restrictions } from '../models/restrictions';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiKey: string = this.config.getTmdbKey();
  // private imdbKey: string = this.config.getImdbKey();
  private omdbKey: string = this.config.getOmdbKey();
  // private urlImdb: string =
  //   'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=';
  private UrlOmdb: string = `https://www.omdbapi.com/?apikey=${this.omdbKey}&i=`;

  private urlBase: string = 'https://api.themoviedb.org/3';

  private urlMoviesRestrictions: string = `${this.urlBase}/certification/movie/list?api_key=${this.apiKey}`;

  private urlShowsRestrictions: string = `${this.urlBase}/certification/tv/list?api_key=${this.apiKey}`;

  private urlPopularMovies: string = `${this.urlBase}/trending/movie/day?api_key=${this.apiKey}`;
  private urlPopularShows: string = `${this.urlBase}/trending/tv/day?api_key=${this.apiKey}`;

  private urlSearchMovies: string = `${this.urlBase}/search/movie?api_key=${this.apiKey}`;
  private urlSearchShows: string = `${this.urlBase}/search/tv?api_key=${this.apiKey}`;

  urlImgOriginal: string = 'https://www.themoviedb.org/t/p/original';
  urlImg1280: string = 'https://www.themoviedb.org/t/p/w1280';
  urlImg600: string = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2';
  urlImg220: string = 'https://www.themoviedb.org/t/p/w220_and_h330_bestv2';
  urlImg185: string = 'https://www.themoviedb.org/t/p/w185';
  urlImg150: string = 'https://www.themoviedb.org/t/p/w150_and_h225_bestv2';
  urlImg130: string = 'https://www.themoviedb.org/t/p/w130_and_h195_bestv2';
  urlImg94: string = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2';

  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  getPopularMovies(
    page: string = '1',
    language: string = 'pl'
  ): Observable<TmdbResponse> {
    let searchParams = new HttpParams()
      .set('page', page)
      .set('language', language);

    return this.httpClient.get<TmdbResponse>(this.urlPopularMovies, {
      params: searchParams,
    });
  }

  getPopularShows(
    page: string = '1',
    language: string = 'pl'
  ): Observable<TmdbResponse> {
    let searchParams = new HttpParams()
      .set('page', page)
      .set('language', language);

    return this.httpClient.get<TmdbResponse>(this.urlPopularShows, {
      params: searchParams,
    });
  }

  getMovies(
    query: string,
    page: string = '1',
    year: string = '',
    language: string = 'pl'
  ): Observable<TmdbResponse> {
    let searchParams = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('primary_release_year', year)
      .set('language', language);

    return this.httpClient.get<TmdbResponse>(this.urlSearchMovies, {
      params: searchParams,
    });
  }
  getShows(
    query: string,
    page: string = '1',
    year: string = '',
    language: string = 'pl'
  ): Observable<TmdbResponse> {
    let searchParams = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('first_air_date_year', year)
      .set('language', language);

    return this.httpClient.get<TmdbResponse>(this.urlSearchShows, {
      params: searchParams,
    });
  }
  getMovieDetails(
    movieId: string,
    language: string = 'pl'
  ): Observable<VideoDetails> {
    let searchParams = new HttpParams()
      .set('language', language)
      .set(
        'append_to_response',
        'credits,external_ids,release_dates,images,recommendations,similar,reviews'
      )
      .set('include_image_language', 'pl,en,null');

    return this.httpClient.get<VideoDetails>(
      `${this.urlBase}/movie/${movieId}?api_key=${this.apiKey}`,
      {
        params: searchParams,
      }
    );
  }
  getShowDetails(
    showId: string,
    language: string = 'pl'
  ): Observable<VideoDetails> {
    let searchParams = new HttpParams()
      .set('language', language)
      .set(
        'append_to_response',
        'credits,external_ids,content_ratings,images,recommendations,similar,reviews'
      )
      .set('include_image_language', 'pl,en,null');

    return this.httpClient.get<VideoDetails>(
      `${this.urlBase}/tv/${showId}?api_key=${this.apiKey}&language=en`,
      {
        params: searchParams,
      }
    );
  }

  getMoviesRestrictionsDetails(): Observable<Restrictions> {
    return this.httpClient.get<Restrictions>(`${this.urlMoviesRestrictions}`);
  }
  getShowsRestrictionsDetails(): Observable<Restrictions> {
    return this.httpClient.get<Restrictions>(`${this.urlShowsRestrictions}`);
  }

  // RapidAPI query
  // getImdbData(query: string): Observable<any> {
  //   let imdbHeaders = new HttpHeaders({
  //     'x-rapidapi-key': this.imdbKey,
  //     'x-rapidapi-host': 'imdb8.p.rapidapi.com',
  //   });

  //   return this.httpClient.get(this.urlImdb + query, { headers: imdbHeaders });
  // }

  // OmdbAPI query
  // getOmdbData(imdbId: string): Observable<any> {
  //   return this.httpClient.get(this.UrlOmdb + imdbId);
  // }

  // test version
  getOmdbData(query: string): Observable<any> {
    console.log('=== ZAPYTANIE DO IMDB WYŁĄCZONE ===');

    return of({ imdbRating: '9.9', imdbVotes: '99,999' });
  }
}
