import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PersonDetails } from 'src/app/models/person-details';
import { VideoDetails } from 'src/app/models/video-details';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';
import { OnDestroy } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';
import { SeoService } from 'src/app/services/seo.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-photo-collection',
  templateUrl: './photo-collection.component.html',
  styleUrls: ['./photo-collection.component.scss'],
})
export class PhotoCollectionComponent implements OnInit, OnDestroy {
  isVideo: boolean;
  showLargePicture: boolean = false;
  detailsVideo: VideoDetails;
  detailsVideoSubscription: Subscription;
  detailsPerson: PersonDetails;
  detailsPersonSubscription: Subscription;
  photoType: string;
  photoPath: string;
  urlImg600: string;
  urlImgWide250: string;
  defaultPhotoPath: string = 'assets/img/cast94.jpg';
  backdropPath: string;
  defaultBackdropPath: string;
  dimensionsPhoto: Array<number> = [94, 141];
  dimensionsPoster: Array<number> = [94, 141];
  dimensionsBackdrop: Array<number> = [250, 141];
  largePicturePath: string;

  constructor(
    private http: HttpService,
    private data: DataService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private spinner: SpinnerService
  ) {
    this.photoPath = this.http.urlImg94;
    this.backdropPath = this.http.urlImg1280;
    this.defaultBackdropPath = this.data.defaultBackdropPath;
    this.urlImg600 = this.http.urlImg600;
    this.urlImgWide250 = this.http.urlImgWide250;
  }

  ngOnInit(): void {
    this.setInitialParameters();
    switch (this.isVideo) {
      case true:
        this.detailsVideoSubscription = this.data
          .getVideoDetails()
          .subscribe((details) => {
            if (details) {
              this.detailsVideo = details;
              this.setMetaTagsVideo();
            } else {
              this.getVideoDetailsFromServer();
            }
          });
        break;
      case false:
        this.detailsPersonSubscription = this.data
          .getPersonDetails()
          .subscribe((details) => {
            if (details) {
              this.detailsPerson = details;
              this.setMetaTagsPerson();
            } else {
              this.getPersonDetailsFromServer();
            }
          });
        break;
    }
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    this.isVideo
      ? this.detailsVideoSubscription.unsubscribe()
      : this.detailsPersonSubscription.unsubscribe();
  }

  setInitialParameters() {
    const initialParameters: Array<string> = this.location.path().split(`/`);
    this.photoType = initialParameters[3];
    if (initialParameters[1] === 'movie' || initialParameters[1] === 'tv') {
      this.isVideo = true;
    } else {
      this.isVideo = false;
    }
  }

  getVideoDetailsFromServer() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (initialParameters[1] === 'movie') {
        this.http.getMovieDetails(params.get('id')).subscribe(
          (res) => {
            this.detailsVideo = res;
            this.setMetaTagsVideo();
            this.data.setVideoDetails(this.detailsVideo);
            setTimeout(() => {
              this.setBackdropPath(
                `${this.backdropPath}${this.detailsVideo.backdrop_path}`
              );
            }, 0);
          },
          (error) => {
            this.handleError(error);
          }
        );
      } else {
        this.http.getShowDetails(params.get('id')).subscribe(
          (res) => {
            this.detailsVideo = res;
            this.setMetaTagsVideo();
            this.data.setVideoDetails(this.detailsVideo);
            setTimeout(() => {
              this.setBackdropPath(
                `${this.backdropPath}${this.detailsVideo.backdrop_path}`
              );
            }, 0);
          },
          (error) => {
            this.handleError(error);
          }
        );
      }
    });
  }

  getPersonDetailsFromServer() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.http.getPersonDetails(params.get('id')).subscribe(
        (res) => {
          this.detailsPerson = res;
          this.setMetaTagsPerson();
          this.data.setPersonDetails(this.detailsPerson);
        },
        (error) => {
          this.handleError(error);
        }
      );
    });
  }

  setMetaTagsVideo() {
    const title: string = this.detailsVideo.title
      ? `${
          this.detailsVideo.title.length < 44
            ? this.detailsVideo.title
            : this.detailsVideo.title.slice(0) + '...'
        } | Filmoteka`
      : `${
          this.detailsVideo.name.length < 44
            ? this.detailsVideo.name
            : this.detailsVideo.name.slice(0) + '...'
        } | Filmoteka`;

    this.seo.setMetaTitle(title);

    const description: string = this.detailsVideo.overview
      ? this.detailsVideo.overview
      : 'Informacje o filmach, serialach, ich twórcach i aktorach';
    const imgPath: string = this.detailsVideo.poster_path
      ? this.photoPath + this.detailsVideo.poster_path
      : 'https://filmy.pewube.eu/filmoteka-ogi.png';
    const tags: MetaDefinition[] = [
      {
        name: 'description',
        content: `${description.slice(0, 150)} ...`,
      },
      { property: 'og:title', content: title },
      {
        property: 'og:description',
        content: `${description.slice(0, 150)} ...`,
      },
      {
        property: 'og:image',
        content: imgPath,
      },
      {
        property: 'og:url',
        content: `https://filmy.pewube.eu${this.location.path(false)}`,
      },
    ];
    this.seo.setMetaTags(tags);
  }

  setMetaTagsPerson() {
    const title: string = this.detailsPerson.name
      ? `${
          this.detailsPerson.name.length < 44
            ? this.detailsPerson.name
            : this.detailsPerson.name.slice(0) + '...'
        } | Filmoteka`
      : `${
          this.detailsPerson.name.length < 44
            ? this.detailsPerson.name
            : this.detailsPerson.name.slice(0) + '...'
        } | Filmoteka`;

    this.seo.setMetaTitle(title);

    const description: string = this.detailsPerson.biography
      ? this.detailsPerson.biography
      : 'Informacje o filmach, serialach, ich twórcach i aktorach';
    const imgPath: string = this.detailsPerson.profile_path
      ? this.photoPath + this.detailsPerson.profile_path
      : 'https://filmy.pewube.eu/filmoteka-ogi.png';
    const tags: MetaDefinition[] = [
      {
        name: 'description',
        content: `${description.slice(0, 150)} ...`,
      },
      { property: 'og:title', content: title },
      {
        property: 'og:description',
        content: `${description.slice(0, 150)} ...`,
      },
      {
        property: 'og:image',
        content: imgPath,
      },
      {
        property: 'og:url',
        content: `https://filmy.pewube.eu${this.location.path(false)}`,
      },
    ];
    this.seo.setMetaTags(tags);
  }

  setBackdropPath(path: string) {
    if (this.detailsVideo && this.detailsVideo.backdrop_path) {
      this.data.setBackdropPath(path);
    } else {
      this.data.setBackdropPath(this.defaultBackdropPath);
    }
  }

  handleError(error) {
    this.router.navigate([`/page-not-found/${error.status}`], {
      state: {
        serverStatus: error.status,
        apiStatus: error.error.status_code,
        apiMessage: error.error.status_message,
      },
    });
  }

  templatePageTitle() {
    switch (this.photoType) {
      case 'photos':
        return 'Zdjęcia';
        break;
      case 'posters':
        return 'Plakaty';
        break;
      case 'backdrops':
        return 'Grafiki';
        break;
    }
  }

  enlargePicture(path: string) {
    this.showLargePicture = true;
    this.largePicturePath = path;
    this.spinner.loading = true;
  }

  closeLargePicture(event): void {
    this.showLargePicture = !event;
  }

  goBack() {
    this.location.back();
  }
}
