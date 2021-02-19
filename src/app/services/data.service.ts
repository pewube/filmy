import { Injectable } from '@angular/core';
import { TmdbResponse } from '../models/tmdb-response';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private query: string;
  private resultsMovies: TmdbResponse;
  private resultsShows: TmdbResponse;

  constructor() {}

  setQuery(data: string): void {
    this.query = data;
    console.log('query z serwisu ', this.query);
  }
  setResultMovies(data: TmdbResponse): void {
    this.resultsMovies = data;
    console.log('localData movies ', this.resultsMovies);
  }
  setResultShows(data: TmdbResponse): void {
    this.resultsShows = data;
    console.log('localData shows ', this.resultsShows);
  }

  getQuery(): string {
    console.log('query z getserwisu ', this.query);
    return this.query;
  }
  getResultMovies(): TmdbResponse {
    console.log('movies z get serwisu ', this.resultsMovies);
    return this.resultsMovies;
  }
  getResultShows(): TmdbResponse {
    console.log('shows z get serwisu ', this.resultsShows);
    return this.resultsShows;
  }
}
