import { TmdbResponse } from './../models/tmdb-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieDetails } from '../models/movie-details';
import { ShowDetails } from '../models/show-details';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiKey: string = '273b8b0772fe22af11cae8460af0d5f5';
  private urlBase: string = 'https://api.themoviedb.org/3';
  private urlSearchAll: string = `${this.urlBase}/search/multi?api_key=${this.apiKey}&language=pl&query=`;

  private urlSearchMovies: string = `${this.urlBase}/search/movie?api_key=${this.apiKey}`;
  private urlSearchShows: string = `${this.urlBase}/search/tv?api_key=${this.apiKey}`;

  urlImgOriginal: string = 'https://www.themoviedb.org/t/p/original';
  urlImg1280: string = 'https://www.themoviedb.org/t/p/w1280';
  urlImg600: string = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2';
  urlImg94: string = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2';

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
    console.log(this.urlSearchMovies + query);

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
  ): Observable<MovieDetails> {
    let searchParams = new HttpParams().set('language', language);

    return this.httpClient.get<MovieDetails>(
      `${this.urlBase}/movie/${movieId}?api_key=${this.apiKey}`,
      {
        params: searchParams,
      }
    );
  }
  getShowDetails(
    showId: string,
    language: string = 'pl'
  ): Observable<ShowDetails> {
    let searchParams = new HttpParams().set('language', language);

    return this.httpClient.get<ShowDetails>(
      `${this.urlBase}/tv/${showId}?api_key=${this.apiKey}`,
      {
        params: searchParams,
      }
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
