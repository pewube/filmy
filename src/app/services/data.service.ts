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

  private isMovie$ = new BehaviorSubject<boolean>(true);

  private backdropPath$ = new BehaviorSubject<string>(
    'assets/img/popcorn1280.jpg'
  );

  private videoDetails$ = new BehaviorSubject<VideoDetails>(null);

  private personDetails$ = new BehaviorSubject<PersonDetails>(null);

  getIsMovie(): Observable<boolean> {
    return this.isMovie$.asObservable();
  }

  setIsMovie(type: boolean) {
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

  getPersonDetails(): Observable<PersonDetails> {
    return this.personDetails$.asObservable();
  }

  setPersonDetails(details: PersonDetails) {
    this.personDetails$.next(details);
  }
}
