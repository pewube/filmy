import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';
import { SeoService } from './services/seo.service';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  @HostListener('window:scroll')
  showBtnUp(): void {
    if (window.scrollY > window.innerHeight) {
      this.btnUp = true;
    } else {
      this.btnUp = false;
    }
  }
  @HostListener('window:load')
  loaded(): void {
    this.spinner.loading = false;
  }

  btnUp: boolean = false;
  isReset: boolean = false;
  showDialog: boolean = false;
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
    private seo: SeoService,
    private router: Router,
    public spinner: SpinnerService
  ) {
    this.backdropDefault = this.data.defaultBackdropPath;
  }

  ngOnInit() {
    this.spinner.loading = true;
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

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.spinner.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.spinner.loading = false;
      }
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

  dialogOn() {
    this.showDialog = true;
  }

  dialogOff(event) {
    this.showDialog = !event;
  }

  goUp() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  reset() {
    this.isReset = true;
    setTimeout(() => {
      this.isReset = false;
    }, 100);
  }
}
