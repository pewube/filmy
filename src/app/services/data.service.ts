import { Injectable } from '@angular/core';
import { MovieDetails } from '../models/movie-details';
import { ShowDetails } from '../models/show-details';
import { TmdbResponse } from '../models/tmdb-response';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private query: string;
  private numberOfMovies: number;
  private numberOfShows: number;

  constructor() {}

  setQuery(data: string) {
    this.query = data;
    console.log('query z serwisu ', this.query);
  }
  setNumberOfMovies(data: number) {
    this.numberOfMovies = data;
    console.log('liczba movies z serwisu ', this.numberOfMovies);
  }
  setNumberOfShows(data: number) {
    this.numberOfShows = data;
    console.log('liczba shows z serwisu ', this.numberOfShows);
  }

  getQuery(): string {
    console.log('query z getserwisu ', this.query);
    return this.query;
  }
  getNumberOfMovies(): number {
    console.log('liczba movies z get serwisu ', this.numberOfMovies);
    return this.numberOfMovies;
  }
  getNumberOfShows(): number {
    console.log('liczba shows z get serwisu ', this.numberOfShows);
    return this.numberOfShows;
  }
}
