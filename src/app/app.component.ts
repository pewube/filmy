import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  isReset: boolean = false;
  backdropPath: string = '';
  backdropPathSubscription: Subscription;
  backdropDefault: string = 'assets/img/popcorn1280.jpg';
  backgroundSrc: string = this.backdropPath
    ? this.backdropPath
    : this.backdropDefault;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.backdropPathSubscription = this.data.currentBackdropPath.subscribe(
      (path) => {
        this.backdropPath = path;
      }
    );
  }

  ngOnDestroy() {
    this.backdropPathSubscription.unsubscribe();
  }

  setBackgroundSrc() {
    return this.backdropPath ? this.backdropPath : this.backdropDefault;
  }

  reset() {
    this.isReset = true;
    setTimeout(() => {
      this.isReset = false;
    }, 100);
  }
}
