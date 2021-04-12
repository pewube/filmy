import { TmdbResponse } from 'src/app/models/tmdb-response';
import { ImdbRating } from './../models/imdb-data';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonDetails } from '../models/person-details';
import { VideoDetails } from '../models/video-details';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  defaultBackdropPath: string = 'assets/img/popcorn1280.jpg';
  defaultPosterPath: string = 'assets/img/movie220.jpg';
  private backdropPath$ = new BehaviorSubject<string>(
    'assets/img/popcorn1280.jpg'
  );
  private popularMovies$ = new BehaviorSubject<TmdbResponse>(null);
  private popularShows$ = new BehaviorSubject<TmdbResponse>(null);
  private isMovie$ = new BehaviorSubject<boolean>(true);
  private videoDetails$ = new BehaviorSubject<VideoDetails>(null);
  private videoDetailsEn$ = new BehaviorSubject<VideoDetails>(null);
  private personDetails$ = new BehaviorSubject<PersonDetails>(null);
  private personDetailsEn$ = new BehaviorSubject<PersonDetails>(null);
  private imdbData$ = new BehaviorSubject<ImdbRating>({
    imdbRating: null,
    imdbVotes: null,
  });

  getPopularMovies(): Observable<TmdbResponse> {
    return this.popularMovies$.asObservable();
  }

  setPopularMovies(data: TmdbResponse) {
    this.popularMovies$.next(data);
  }
  getPopularShows(): Observable<TmdbResponse> {
    return this.popularShows$.asObservable();
  }

  setPopularShows(data: TmdbResponse) {
    this.popularShows$.next(data);
  }

  get isItMovie(): Observable<boolean> {
    return this.isMovie$.asObservable();
  }

  set isMovie(type: boolean) {
    this.isMovie$.next(type);
  }

  getBackdropPath(): Observable<string> {
    return this.backdropPath$.asObservable();
  }

  setBackdropPath(path: string) {
    this.backdropPath$.next(path);
  }

  getVideoDetails(): Observable<VideoDetails> {
    return this.videoDetails$.asObservable();
  }

  setVideoDetails(details: VideoDetails) {
    this.videoDetails$.next(details);
  }

  getVideoDetailsEn(): Observable<VideoDetails> {
    return this.videoDetailsEn$.asObservable();
  }

  setVideoDetailsEn(details: VideoDetails) {
    this.videoDetailsEn$.next(details);
  }

  getPersonDetails(): Observable<PersonDetails> {
    return this.personDetails$.asObservable();
  }

  setPersonDetails(details: PersonDetails) {
    this.personDetails$.next(details);
  }

  getPersonDetailsEn(): Observable<PersonDetails> {
    return this.personDetailsEn$.asObservable();
  }

  setPersonDetailsEn(details: PersonDetails) {
    this.personDetailsEn$.next(details);
  }

  getImdbData(): Observable<ImdbRating> {
    return this.imdbData$.asObservable();
  }

  setImdbData(details: ImdbRating) {
    this.imdbData$.next(details);
  }
}
