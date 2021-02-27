import { TmdbResponse } from 'src/app/models/tmdb-response';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private isMovie = new BehaviorSubject(true);
  currentMediaType = this.isMovie.asObservable();

  private backdropPath = new BehaviorSubject('blank');
  currentBackdropPath = this.backdropPath.asObservable();

  constructor() {}

  changeMediaType(type: boolean) {
    this.isMovie.next(type);
  }

  changeBackdropPath(path: string) {
    this.backdropPath.next(path);
  }
}
