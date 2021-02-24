import { TmdbResponse } from 'src/app/models/tmdb-response';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private backdropPath = new BehaviorSubject('blank');
  currentBackdropPath = this.backdropPath.asObservable();

  constructor() {}

  changeBackdropPath(path: string) {
    this.backdropPath.next(path);
  }
}
