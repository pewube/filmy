import { TmdbResponse } from './../models/tmdb-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { VideoDetails } from '../models/video-details';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiKey: string = this.config.getTmdbKey();
  private imdbKey: string = this.config.getImdbKey();
  private urlImdb: string =
    'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=';

  private urlBase: string = 'https://api.themoviedb.org/3';
  private urlSearchAll: string = `${this.urlBase}/search/multi?api_key=${this.apiKey}&language=pl&query=`;

  private urlSearchMovies: string = `${this.urlBase}/search/movie?api_key=${this.apiKey}`;
  private urlSearchShows: string = `${this.urlBase}/search/tv?api_key=${this.apiKey}`;

  urlImgOriginal: string = 'https://www.themoviedb.org/t/p/original';
  urlImg1280: string = 'https://www.themoviedb.org/t/p/w1280';
  urlImg600: string = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2';
  urlImg94: string = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2';

  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  getAll(query: string): Observable<TmdbResponse> {
    return this.httpClient.get<TmdbResponse>(this.urlSearchAll + query);
  }
  getMovies(
    query: string,
    page: string = '1',
    language: string = 'pl'
  ): Observable<TmdbResponse> {
    let searchParams = new HttpParams()
      .set('language', language)
      .set('page', page)
      .set('query', query);

    return this.httpClient.get<TmdbResponse>(this.urlSearchMovies, {
      params: searchParams,
    });
  }
  getShows(
    query: string,
    page: string = '1',
    language: string = 'pl'
  ): Observable<TmdbResponse> {
    let searchParams = new HttpParams()
      .set('language', language)
      .set('page', page)
      .set('query', query);
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
      .set('append_to_response', 'credits,external_ids,release_dates,images')
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
      .set('append_to_response', 'credits,external_ids,content_ratings,images')
      .set('include_image_language', 'pl,en,null');

    return this.httpClient.get<VideoDetails>(
      `${this.urlBase}/tv/${showId}?api_key=${this.apiKey}&language=en`,
      {
        params: searchParams,
      }
    );
  }

  getImdbData(query: string): Observable<any> {
    let imdbHeaders = new HttpHeaders({
      'x-rapidapi-key': this.imdbKey,
      'x-rapidapi-host': 'imdb8.p.rapidapi.com',
    });

    return this.httpClient.get(this.urlImdb + query, { headers: imdbHeaders });
  }

  // getImdbData(query: string): Observable<any> {
  //   console.log('=== ZAPYTANIE DO IMDB WYŁĄCZONE ===');

  //   return of('');
  // }
}
