import { Component } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  routeState: any;
  serverStatus: number;
  apiStatus: number;
  apiMessage: string;

  constructor(private router: Router, private seo: SeoService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.routeState = this.router.getCurrentNavigation().extras.state;
      this.serverStatus = this.routeState.serverStatus;
      this.apiStatus = this.routeState.apiStatus;
      this.apiMessage = this.routeState.apiMessage;
    }
  }

  setMetaTags() {
    this.seo.setMetaTitle('Filmoteka | filmy i seriale');

    const tags: MetaDefinition[] = [
      {
        name: 'description',
        content: 'Informacje o filmach, serialach, ich twórcach i aktorach',
      },
      { property: 'og:title', content: 'Filmoteka | filmy i seriale' },
      {
        property: 'og:description',
        content: 'Informacje o filmach, serialach, ich twórcach i aktorach',
      },
      {
        property: 'og:image',
        content: 'https://filmy.pewube.eu/filmoteka-ogi.png',
      },
      { property: 'og:url', content: 'https://filmy.pewube.eu/' },
    ];
    this.seo.setMetaTags(tags);
  }
}
