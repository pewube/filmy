import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';
import {
  VideoActor,
  VideoCertification,
  VideoCrew,
  VideoDetails,
  VideoSeason,
} from 'src/app/models/video-details';
import { ToTranslate } from 'src/app/models/google-translation';
import { GtranslateService } from 'src/app/services/gtranslate.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoDetailsComponent implements OnInit, OnDestroy {
  movieFlag: boolean;
  posterPath: string;
  actorPath: string;
  backdropPath: string;

  details: VideoDetails;
  overviewEn: string;
  overviewTranslated: string;
  buttonOn: boolean = true;
  screenwriters: Array<VideoCrew> = [];
  directors: Array<VideoCrew> = [];
  numberOfActorsInArray: number = 30;
  actors: Array<VideoActor> = [];
  seasons: Array<VideoSeason> = [];
  certifications: Array<VideoCertification> = [];
  imdbRating: number;
  imdbRatingCount: number;
  statusTranslated: string;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private translator: GtranslateService,
    private data: DataService
  ) {
    this.posterPath = this.http.urlImg150;
    this.actorPath = this.http.urlImg94;
    this.backdropPath = this.http.urlImg1280;
  }

  ngOnInit(): void {
    this.switchData();

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (this.movieFlag) {
        // polish movie details
        this.http.getMovieDetails(params.get('id')).subscribe(
          (res) => {
            console.log('Movie details: ', res);
            this.details = res;
            this.createScreenwritersArray(
              this.details.credits,
              this.screenwriters
            );
            this.createDirectorsArray(this.details.credits, this.directors);
            this.createActorsArray(
              this.details.credits,
              this.actors,
              this.numberOfActorsInArray
            );
            this.createMovieCertificationsArray(
              this.details.release_dates,
              this.certifications
            );

            this.changeBackdropPath(
              `${this.backdropPath}${this.details.backdrop_path}`
            );

            this.translateStatus(this.details.status);

            // english movie details
            if (!this.details.overview) {
              this.http.getMovieDetails(params.get('id'), 'en').subscribe(
                (res) => {
                  this.overviewEn = res.overview;
                },
                (error) => console.log('Błąd: ', error)
              );
            }

            //imdb movie data
            if (res.external_ids.imdb_id) {
              this.http.getImdbData(res.external_ids.imdb_id).subscribe(
                (omdbData) => {
                  this.imdbRating = Number(omdbData.imdbRating);
                  this.imdbRatingCount = Number(
                    omdbData.imdbVotes.replace(/,/g, '')
                  );
                },
                (error) => console.log('Błąd IMDB: ', error)
              );
            }
          },
          (error) => console.log('Błąd: ', error)
        );
      } else {
        // polish tv series details
        this.http.getShowDetails(params.get('id')).subscribe(
          (res) => {
            console.log('TVShow details: ', res);
            this.details = res;
            this.createActorsArray(
              this.details.credits,
              this.actors,
              this.numberOfActorsInArray
            );
            this.createShowCertificationsArray(
              this.details.content_ratings,
              this.certifications
            );
            this.createSeasonsArray(this.details.seasons, this.seasons);

            this.changeBackdropPath(
              `${this.backdropPath}${this.details.backdrop_path}`
            );

            this.translateStatus(this.details.status);

            // english  tv series details
            if (!this.details.overview) {
              this.http.getShowDetails(params.get('id'), 'en').subscribe(
                (res) => {
                  this.overviewEn = res.overview;
                },
                (error) => console.log('Błąd: ', error)
              );
            }

            //imdb  tv series data
            if (res.external_ids.imdb_id) {
              this.http.getImdbData(res.external_ids.imdb_id).subscribe(
                (omdbData) => {
                  this.imdbRating = Number(omdbData.imdbRating);
                  this.imdbRatingCount = Number(
                    omdbData.imdbVotes.replace(/,/g, '')
                  );
                },
                (error) => console.log('Błąd IMDB: ', error)
              );
            }
          },
          (error) => console.log('Błąd: ', error)
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.changeBackdropPath('blank');
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
        this.statusTranslated = 'aktywny';
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

  createActorsArray(input, output: Array<VideoActor>, outputLength: number) {
    if (input.cast.length < outputLength) {
      for (let actor of input.cast) {
        if (actor.character.toLowerCase() === 'himself') {
          actor.character = actor.name;
        }
        output.push(actor);
      }
    } else {
      for (let i = 0; i < outputLength; i++) {
        if (input.cast[i].character.toLowerCase() === 'himself') {
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
      (error) => console.error(error);
  }

  changeBackdropPath(path: string) {
    if (this.details && this.details.backdrop_path) {
      this.data.changeBackdropPath(path);
    }
  }

  goToResults() {
    this.location.back();
  }
}
