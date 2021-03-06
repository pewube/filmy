import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private isMovie = new BehaviorSubject(true);
  currentMediaType = this.isMovie.asObservable();

  private backdropPath = new BehaviorSubject('assets/img/popcorn1280.jpg');
  currentBackdropPath = this.backdropPath.asObservable();

  constructor() {}

  changeMediaType(type: boolean) {
    this.isMovie.next(type);
  }

  changeBackdropPath(path: string) {
    this.backdropPath.next(path);
  }
}
