import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private isLoading$ = new BehaviorSubject<boolean>(false);

  get isLoading() {
    return this.isLoading$.asObservable();
  }

  set loading(value: boolean) {
    this.isLoading$.next(value);
  }
}
