import { SpinnerService } from './../../services/spinner.service';
import { ImdbRating } from './../../models/imdb-data';
import { SeoService } from './../../services/seo.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';
import {
  VideoActor,
  VideoCertification,
  VideoCrew,
  VideoDetails,
  VideoImage,
  VideoSeason,
} from 'src/app/models/video-details';
import { ToTranslate } from 'src/app/models/google-translation';
import { GtranslateService } from 'src/app/services/gtranslate.service';
import { DataService } from 'src/app/services/data.service';
import localePl from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { Subscription } from 'rxjs';
import { MetaDefinition } from '@angular/platform-browser';
registerLocaleData(localePl);

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoDetailsComponent implements OnInit, OnDestroy {
  @ViewChildren('list') listsToScroll: QueryList<ElementRef>;

  isMovie: boolean;
  showLargePicture: boolean = false;
  showDialog: boolean = false;
  posterPath: string;
  profilePath: string;
  backdropPath: string;
  largePicturePath: string;
  urlImg130: string;
  urlImg600: string;
  urlImgWide250: string;
  urlImgWide780: string;
  defaultPosterPath: string = 'assets/img/movie220.jpg';
  defaultProfilePath: string = 'assets/img/cast94.jpg';
  defaultBackdropPath: string;

  details: VideoDetails;
  detailsSubscription: Subscription;
  localDetails: VideoDetails;
  detailsEn: VideoDetails;
  detailsEnSubscription: Subscription;
  localDetailsEn: VideoDetails;
  imdbData: ImdbRating = {
    imdbRating: null,
    imdbVotes: null,
  };
  imdbDataSubscription: Subscription;
  localImdbData: ImdbRating;

  overviewTranslated: string;
  translateBtn: boolean = true;
  screenwriters: Array<VideoCrew> = [];
  directors: Array<VideoCrew> = [];
  numberOfItemsInArray: number = 165;
  actors: Array<VideoActor> = [];
  seasons: Array<VideoSeason> = [];
  certifications: Array<VideoCertification> = [];
  backdrops: Array<VideoImage> = [];
  posters: Array<VideoImage> = [];
  statusTranslated: string;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private translator: GtranslateService,
    private data: DataService,
    private seo: SeoService,
    private spinner: SpinnerService
  ) {
    this.urlImg130 = this.http.urlImg130;
    this.urlImg600 = this.http.urlImg600;
    this.posterPath = this.http.urlImg220;
    this.profilePath = this.http.urlImg94;
    this.backdropPath = this.http.urlImg1280;
    this.urlImgWide250 = this.http.urlImgWide250;
    this.urlImgWide780 = this.http.urlImgWide780;
    this.defaultBackdropPath = this.data.defaultBackdropPath;
  }

  ngOnInit(): void {
    this.switchVideoType();
    this.detailsSubscription = this.data
      .getVideoDetails()
      .subscribe((localDetails) => {
        this.localDetails = localDetails;
      });
    this.detailsEnSubscription = this.data
      .getVideoDetailsEn()
      .subscribe((localDetailsEn) => {
        this.localDetailsEn = localDetailsEn;
      });
    this.imdbDataSubscription = this.data
      .getImdbData()
      .subscribe((localImdbData) => {
        this.localImdbData = localImdbData;
      });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.switchVideoType();
      this.getData(params.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.detailsSubscription.unsubscribe();
    this.detailsEnSubscription.unsubscribe();
    this.imdbDataSubscription.unsubscribe();
  }

  switchVideoType() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (initialParameters[1] === 'movie') {
      this.isMovie = true;
    } else {
      this.isMovie = false;
    }
  }

  getData(videoId: string) {
    if (this.localDetails && this.localDetails.id.toString() === videoId) {
      this.details = this.localDetails;
      if (
        this.localDetailsEn &&
        this.localDetailsEn.id.toString() === videoId
      ) {
        this.detailsEn = this.localDetailsEn;
      }
      if (this.details.external_ids.imdb_id && this.localImdbData) {
        this.imdbData = this.localImdbData;
      }
      this.setMetaTags();
      this.processData();
    } else {
      switch (this.isMovie) {
        case true:
          this.http.getMovieDetails(videoId).subscribe(
            (res) => {
              this.details = res;
              // console.log('Movie details: ', this.details);
              if (!this.details.overview) {
                this.http
                  .getMovieDetails(this.route.snapshot.paramMap.get('id'), 'en')
                  .subscribe(
                    (res) => {
                      this.detailsEn = res;
                      this.data.setVideoDetailsEn(this.detailsEn);
                    },
                    (error) => console.log('Movie english data error: ', error)
                  );
                this.translateBtn = true;
              }
              if (this.details.external_ids.imdb_id) {
                this.http
                  .getOmdbData(this.details.external_ids.imdb_id)
                  .subscribe(
                    (omdbData) => {
                      this.imdbData.imdbRating =
                        omdbData.imdbRating && omdbData.imdbRating !== 'N/A'
                          ? Number(omdbData.imdbRating)
                          : null;
                      this.imdbData.imdbVotes =
                        omdbData.imdbVotes && omdbData.imdbVotes !== 'N/A'
                          ? Number(omdbData.imdbVotes.replace(/,/g, ''))
                          : null;
                      this.data.setImdbData(this.imdbData);
                    },
                    (error) => console.log('OMDB data error ', error)
                  );
              }
              this.setMetaTags();
              this.processData();
            },
            (error) => {
              this.handleError(error);
            }
          );
          break;
        case false:
          this.http.getShowDetails(videoId).subscribe(
            (res) => {
              this.details = res;
              // console.log('Show details: ', this.details);
              if (!this.details.overview) {
                this.http
                  .getShowDetails(this.route.snapshot.paramMap.get('id'), 'en')
                  .subscribe(
                    (res) => {
                      this.detailsEn = res;
                      this.data.setVideoDetailsEn(this.detailsEn);
                    },
                    (error) =>
                      console.log('TVShows english data error: ', error)
                  );
                this.translateBtn = true;
              }
              if (this.details.external_ids.imdb_id) {
                this.http
                  .getOmdbData(this.details.external_ids.imdb_id)
                  .subscribe(
                    (omdbData) => {
                      this.imdbData.imdbRating =
                        omdbData.imdbRating && omdbData.imdbRating !== 'N/A'
                          ? Number(omdbData.imdbRating)
                          : null;
                      this.imdbData.imdbVotes =
                        omdbData.imdbVotes && omdbData.imdbVotes !== 'N/A'
                          ? Number(omdbData.imdbVotes.replace(/,/g, ''))
                          : null;
                    },
                    (error) => console.log('OMDB data error ', error)
                  );
              }
              this.setMetaTags();
              this.processData();
            },
            (error) => {
              this.handleError(error);
            }
          );
          break;
      }
    }
  }

  processData() {
    this.data.setVideoDetails(this.details);

    this.translateStatus(this.details.status);

    this.actors = [];
    this.createActorsArray(
      this.details.credits,
      this.actors,
      this.numberOfItemsInArray
    );

    this.backdrops = [];
    this.createBackdropsArray(
      this.details.images,
      this.backdrops,
      this.numberOfItemsInArray
    );

    this.posters = [];
    this.createPostersArray(
      this.details.images,
      this.posters,
      this.numberOfItemsInArray
    );

    if (this.isMovie) {
      this.screenwriters = [];
      this.createScreenwritersArray(this.details.credits, this.screenwriters);

      this.directors = [];

      this.createDirectorsArray(this.details.credits, this.directors);
      this.certifications = [];

      this.createMovieCertificationsArray(
        this.details.release_dates,
        this.certifications
      );
    } else {
      this.certifications = [];
      this.createShowCertificationsArray(
        this.details.content_ratings,
        this.certifications
      );

      this.seasons = [];
      this.createSeasonsArray(this.details.seasons, this.seasons);
    }

    setTimeout(() => {
      this.scrollElements();
      this.setBackdropPath(`${this.backdropPath}${this.details.backdrop_path}`);
    }, 0);
  }

  setMetaTags() {
    const title: string = this.details.title
      ? `${
          this.details.title.length < 44
            ? this.details.title
            : this.details.title.slice(0) + '...'
        } | Filmoteka`
      : `${
          this.details.name.length < 44
            ? this.details.name
            : this.details.name.slice(0) + '...'
        } | Filmoteka`;

    this.seo.setMetaTitle(title);

    const description: string = this.details.overview
      ? this.details.overview
      : 'Informacje o filmach, serialach, ich twórcach i aktorach';
    const imgPath: string = this.details.poster_path
      ? this.profilePath + this.details.poster_path
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

  translateStatus(input: string) {
    switch (input.toLowerCase()) {
      case 'released':
        this.statusTranslated = 'wydany';
        break;
      case 'planned':
        this.statusTranslated = 'planowany';
        break;
      case 'canceled':
        this.statusTranslated = 'anulowany';
        break;
      case 'ended':
        this.statusTranslated = 'zakończony';
        break;
      case 'returning series':
        this.statusTranslated = 'planowany kolejny sezon';
        break;
      case 'post production':
        this.statusTranslated = 'w postprodukcji';
        break;
      case 'in production':
        this.statusTranslated = 'w produkcji';
        break;
      default:
        this.statusTranslated = input.toLowerCase();
    }
  }

  createScreenwritersArray(input, output: Array<VideoCrew>) {
    for (let el of input.crew) {
      if (
        el.job.toLowerCase() === 'screenplay' ||
        el.job.toLowerCase() === 'writer'
      ) {
        output.push(el);
      }
    }
  }

  createDirectorsArray(input, output: Array<VideoCrew>) {
    for (let el of input.crew) {
      if (el.job.toLowerCase() === 'director') {
        output.push(el);
      }
    }
  }

  createSeasonsArray(input, output: Array<VideoSeason>) {
    if (input.length > 0) {
      for (let season of input) {
        output.push(season);
      }
    }
  }

  createActorsArray(
    input,
    output: Array<VideoActor>,
    outputLength: number = 8
  ) {
    if (input.cast.length < outputLength) {
      for (let actor of input.cast) {
        if (actor.character.toLowerCase().includes('self')) {
          actor.character = actor.name;
        }
        output.push(actor);
      }
    } else {
      for (let i = 0; i < outputLength; i++) {
        if (input.cast[i].character.toLowerCase().includes('self')) {
          input.cast[i].character = input.cast[i].name;
        }
        output.push(input.cast[i]);
      }
    }
  }

  createMovieCertificationsArray(input, output: Array<VideoCertification>) {
    for (let el of input.results) {
      if (
        (el.iso_3166_1 === 'US' ||
          el.iso_3166_1 === 'DE' ||
          el.iso_3166_1 === 'GB' ||
          el.iso_3166_1 === 'FR' ||
          el.iso_3166_1 === 'ES') &&
        el.release_dates[0].certification
      ) {
        output.push({
          country: el.iso_3166_1,
          certification: el.release_dates[0].certification,
        });
        output.sort((a, b) => {
          if (a.country < b.country) {
            return 1;
          }
          if (a.country > b.country) {
            return -1;
          }
          return 0;
        });
      }
    }
  }

  createShowCertificationsArray(input, output: Array<VideoCertification>) {
    for (let el of input.results) {
      if (
        (el.iso_3166_1 === 'US' ||
          el.iso_3166_1 === 'DE' ||
          el.iso_3166_1 === 'GB' ||
          el.iso_3166_1 === 'FR' ||
          el.iso_3166_1 === 'ES') &&
        el.rating
      ) {
        output.push({
          country: el.iso_3166_1,
          certification: el.rating,
        });
        output.sort((a, b) => {
          if (a.country < b.country) {
            return 1;
          }
          if (a.country > b.country) {
            return -1;
          }
          return 0;
        });
      }
    }
  }

  createBackdropsArray(
    input,
    output: Array<VideoImage>,
    outputLength: number = 8
  ) {
    if (input.backdrops.length < outputLength) {
      for (let backdrop of input.backdrops) {
        output.push(backdrop);
      }
    } else {
      for (let i = 0; i < outputLength; i++) {
        output.push(input.backdrops[i]);
      }
    }
  }

  createPostersArray(
    input,
    output: Array<VideoImage>,
    outputLength: number = 8
  ) {
    if (input.posters.length < outputLength) {
      for (let poster of input.posters) {
        output.push(poster);
      }
    } else {
      for (let i = 0; i < outputLength; i++) {
        output.push(input.posters[i]);
      }
    }
  }

  // english overview translation
  translate() {
    const text: ToTranslate = {
      q: this.detailsEn.overview,
      source: 'en',
      target: 'pl',
      format: 'text',
    };
    this.translateBtn = false;
    this.translator.translate(text).subscribe((result) => {
      this.overviewTranslated = result.data.translations[0].translatedText;
      this.detailsEn.overview = this.overviewTranslated;
    }),
      (error) => console.log('Błąd tłumaczenia: ', error);
  }

  setBackdropPath(path: string) {
    if (this.details && this.details.backdrop_path) {
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

  enlargePicture(path: string) {
    this.showLargePicture = true;
    this.largePicturePath = path;
    this.spinner.loading = true;
  }

  enlargePhotoComponentPicture(event) {
    this.showLargePicture = event;
  }

  closeLargePicture(event) {
    this.showLargePicture = !event;
  }

  dialogOn() {
    this.showDialog = true;
  }

  dialogOff(event) {
    this.showDialog = !event;
  }

  scrollElements() {
    window.scrollTo(0, 0);
    if (this.listsToScroll) {
      this.listsToScroll.forEach((list) => {
        list.nativeElement.scrollTo(0, 0);
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
