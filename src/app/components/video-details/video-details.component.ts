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
registerLocaleData(localePl);

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoDetailsComponent implements OnInit, OnDestroy {
  @ViewChildren('list') listsToScroll: QueryList<ElementRef>;

  movieFlag: boolean;
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
  defaultBackdropPath: string = 'assets/img/popcorn1280.jpg';

  details: VideoDetails;
  overviewEn: string;
  overviewTranslated: string;
  buttonOn: boolean = true;
  screenwriters: Array<VideoCrew> = [];
  directors: Array<VideoCrew> = [];
  numberOfItemsInArray: number = 20;
  actors: Array<VideoActor> = [];
  seasons: Array<VideoSeason> = [];
  certifications: Array<VideoCertification> = [];
  backdrops: Array<VideoImage> = [];
  posters: Array<VideoImage> = [];
  imdbRating: number;
  imdbRatingCount: number;
  statusTranslated: string;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private translator: GtranslateService,
    private data: DataService
  ) {
    this.urlImg130 = this.http.urlImg130;
    this.urlImg600 = this.http.urlImg600;
    this.posterPath = this.http.urlImg220;
    this.profilePath = this.http.urlImg94;
    this.backdropPath = this.http.urlImg1280;
    this.urlImgWide250 = this.http.urlImgWide250;
    this.urlImgWide780 = this.http.urlImgWide780;
  }

  ngOnInit(): void {
    this.switchData();

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (this.movieFlag) {
        // polish movie details
        this.http.getMovieDetails(params.get('id')).subscribe(
          (res) => {
            // console.log('Movie details: ', res);
            this.details = res;

            this.changeBackdropPath(
              `${this.backdropPath}${this.details.backdrop_path}`
            );

            this.translateStatus(this.details.status);

            this.screenwriters = [];
            this.createScreenwritersArray(
              this.details.credits,
              this.screenwriters
            );
            this.directors = [];
            this.createDirectorsArray(this.details.credits, this.directors);
            this.actors = [];
            this.createActorsArray(
              this.details.credits,
              this.actors,
              this.numberOfItemsInArray
            );
            this.certifications = [];
            this.createMovieCertificationsArray(
              this.details.release_dates,
              this.certifications
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

            // english movie details
            if (!this.details.overview) {
              this.http.getMovieDetails(params.get('id'), 'en').subscribe(
                (res) => {
                  this.overviewEn = res.overview;
                },
                (error) =>
                  console.log('Błąd pobierania details en dla movie: ', error)
              );
              this.buttonOn = true;
            }

            //imdb movie data
            if (res.external_ids.imdb_id) {
              this.http.getOmdbData(res.external_ids.imdb_id).subscribe(
                (omdbData) => {
                  this.imdbRating =
                    omdbData.imdbRating && omdbData.imdbRating !== 'N/A'
                      ? Number(omdbData.imdbRating)
                      : null;
                  this.imdbRatingCount =
                    omdbData.imdbVotes && omdbData.imdbVotes !== 'N/A'
                      ? Number(omdbData.imdbVotes.replace(/,/g, ''))
                      : null;
                },
                (error) => console.log('Błąd IMDB: ', error)
              );
            }
            this.scrollElements();
          },
          (error) => {
            console.log(error);
            this.router.navigate([`/page-not-found/${error.status}`], {
              state: {
                serverStatus: error.status,
                apiStatus: error.error.status_code,
                apiMessage: error.error.status_message,
              },
            });
          }
        );
      } else {
        // polish tv series details
        this.http.getShowDetails(params.get('id')).subscribe(
          (res) => {
            // console.log('TVShow details: ', res);
            this.details = res;

            this.changeBackdropPath(
              `${this.backdropPath}${this.details.backdrop_path}`
            );

            this.translateStatus(this.details.status);

            this.actors = [];
            this.createActorsArray(
              this.details.credits,
              this.actors,
              this.numberOfItemsInArray
            );
            this.certifications = [];
            this.createShowCertificationsArray(
              this.details.content_ratings,
              this.certifications
            );
            this.seasons = [];
            this.createSeasonsArray(this.details.seasons, this.seasons);
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

            // english  tv series details
            if (!this.details.overview) {
              this.http.getShowDetails(params.get('id'), 'en').subscribe(
                (res) => {
                  this.overviewEn = res.overview;
                },
                (error) =>
                  console.log('Błąd pobierania details en dla tvshow: ', error)
              );
              this.buttonOn = true;
            }

            //imdb  tv series data
            if (res.external_ids.imdb_id) {
              this.http.getOmdbData(res.external_ids.imdb_id).subscribe(
                (omdbData) => {
                  this.imdbRating =
                    omdbData.imdbRating && omdbData.imdbRating !== 'N/A'
                      ? Number(omdbData.imdbRating)
                      : null;
                  this.imdbRatingCount =
                    omdbData.imdbVotes && omdbData.imdbVotes !== 'N/A'
                      ? Number(omdbData.imdbVotes.replace(/,/g, ''))
                      : null;
                },
                (error) => console.log('Błąd IMDB: ', error)
              );
            }
            this.scrollElements();
          },
          (error) => {
            console.log(error);
            this.router.navigate([`/page-not-found/${error.status}`], {
              state: {
                serverStatus: error.status,
                apiStatus: error.error.status_code,
                apiMessage: error.error.status_message,
              },
            });
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.changeBackdropPath(this.defaultBackdropPath);
  }

  switchData() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (initialParameters[1] === 'movie') {
      this.movieFlag = true;
    } else {
      this.movieFlag = false;
    }
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
      q: this.overviewEn,
      source: 'en',
      target: 'pl',
      format: 'text',
    };
    this.buttonOn = false;
    this.translator.translate(text).subscribe((result) => {
      this.overviewTranslated = result.data.translations[0].translatedText;
      this.overviewEn = this.overviewTranslated;
    }),
      (error) => console.log('Błąd tłumaczenia: ', error);
  }

  changeBackdropPath(path: string) {
    if (this.details && this.details.backdrop_path) {
      this.data.changeBackdropPath(path);
    } else {
      this.data.changeBackdropPath(this.defaultBackdropPath);
    }
  }

  enlargePicture(path: string) {
    this.showLargePicture = true;
    this.largePicturePath = path;
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
    setTimeout(() => {
      this.listsToScroll.forEach((list) => {
        list.nativeElement.scrollTo(0, 0);
      });
    }, 0);
  }

  goToResults() {
    this.location.back();
  }
}
