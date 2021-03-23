import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private initMetaTitle: string = 'Filmoteka | filmy i seriale';
  private metaTitle$ = new BehaviorSubject<string>(this.initMetaTitle);

  private initMetaTags: MetaDefinition[] = [
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
  private metaTags$ = new BehaviorSubject<MetaDefinition[]>(this.initMetaTags);

  constructor(private title: Title, private meta: Meta) {}

  getMetaTitle(): Observable<string> {
    return this.metaTitle$.asObservable();
  }

  setMetaTitle(title: string) {
    this.metaTitle$.next(title);
  }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  getMetaTags(): Observable<MetaDefinition[]> {
    return this.metaTags$.asObservable();
  }

  setMetaTags(tags: MetaDefinition[]) {
    this.metaTags$.next(tags);
  }

  updateMetaTags(metaTags: MetaDefinition[]) {
    metaTags.forEach((tag) => this.meta.updateTag(tag));
  }
}
