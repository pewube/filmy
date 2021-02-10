import { TmdbResponse } from './../models/tmdb-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieDetails } from '../models/movie-details';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiKey: string = '273b8b0772fe22af11cae8460af0d5f5';
  private urlBase: string = 'https://api.themoviedb.org/3';
  private urlSearchAll: string = `${this.urlBase}/search/multi?api_key=${this.apiKey}&language=pl&query=`;

  private urlSearchMovies: string = `${this.urlBase}/search/movie?api_key=${this.apiKey}&language=pl&query=`;
  private urlSearchShows: string = `${this.urlBase}/search/tv?api_key=${this.apiKey}&language=pl&page=1&query=`;

  private urlImg1280: string = 'https://www.themoviedb.org/t/p/w1280';
  public urlImg600: string =
    'https://www.themoviedb.org/t/p/w600_and_h900_bestv2';
  public urlImg94: string =
    'https://www.themoviedb.org/t/p/w94_and_h141_bestv2';

  constructor(private httpClient: HttpClient) {}

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
  getMovieDetails(movieId: string): Observable<MovieDetails> {
    return this.httpClient.get<MovieDetails>(
      `${this.urlBase}/movie/${movieId}?api_key=${this.apiKey}&language=pl`
    );
  }
  getShowDetails(showId: string): Observable<Object> {
    return this.httpClient.get<Object>(
      `${this.urlBase}/tv/${showId}?api_key=${this.apiKey}&language=pl`
    );
  }
  getMovieCredits(movieId: string): Observable<MovieDetails> {
    return this.httpClient.get<MovieDetails>(
      `${this.urlBase}/movie/${movieId}/credits?api_key=${this.apiKey}&language=pl`
    );
  }
  getShowCredits(showId: string): Observable<Object> {
    return this.httpClient.get<Object>(
      `${this.urlBase}/tv/${showId}/credits?api_key=${this.apiKey}&language=pl`
    );
  }
}
