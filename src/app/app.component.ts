import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';
import { SeoService } from './services/seo.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  isReset: boolean = false;
  metaTagsSubscription: Subscription;
  metaTitleSubscription: Subscription;
  backdropPath: string = '';
  backdropPathSubscription: Subscription;

  backdropDefault: string = '';
  backgroundSrc: string = this.backdropPath
    ? this.backdropPath
    : this.backdropDefault;

  constructor(
    private data: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seo: SeoService
  ) {
    this.backdropDefault = this.data.defaultBackdropPath;
  }

  ngOnInit() {
    this.metaTitleSubscription = this.seo.getMetaTitle().subscribe((title) => {
      this.seo.updateTitle(title);
    });

    this.metaTagsSubscription = this.seo.getMetaTags().subscribe((tags) => {
      this.seo.updateMetaTags(tags);
    });

    this.backdropPathSubscription = this.data
      .getBackdropPath()
      .subscribe((path) => {
        this.backdropPath = path;
      });
  }

  ngOnDestroy() {
    this.metaTitleSubscription.unsubscribe();
    this.metaTagsSubscription.unsubscribe();
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
