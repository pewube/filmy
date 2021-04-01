import { VideoActor, VideoDetails } from './../../../models/video-details';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SeoService } from 'src/app/services/seo.service';
import { MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit, OnDestroy {
  details: VideoDetails;
  detailsSubscription: Subscription;
  photoPath: string;
  defaultPhotoPath: string = 'assets/img/cast94.jpg';
  backdropPath: string;
  defaultBackdropPath: string;
  actors: Array<VideoActor> = [];

  constructor(
    private http: HttpService,
    private data: DataService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService
  ) {
    this.photoPath = this.http.urlImg94;
    this.backdropPath = this.http.urlImg1280;
    this.defaultBackdropPath = this.data.defaultBackdropPath;
  }

  ngOnInit(): void {
    this.detailsSubscription = this.data
      .getVideoDetails()
      .subscribe((details) => {
        if (details) {
          this.details = details;
          this.setMetaTags();
          setTimeout(() => {
            this.setBackdropPath(
              `${this.backdropPath}${this.details.backdrop_path}`
            );
          }, 0);
          this.actors = [];
          if (this.details.title) {
            this.createMovieActorsArray(this.details.credits, this.actors);
          } else {
            this.createShowActorsArray(
              this.details.aggregate_credits,
              this.actors
            );
          }
        } else {
          this.getDetailsFromServer();
        }
      });
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    this.detailsSubscription.unsubscribe();
  }

  getDetailsFromServer() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (initialParameters[1] === 'movie') {
        this.http.getMovieDetails(params.get('id')).subscribe(
          (res) => {
            this.details = res;
            this.setMetaTags();
            this.data.setVideoDetails(this.details);
            setTimeout(() => {
              this.setBackdropPath(
                `${this.backdropPath}${this.details.backdrop_path}`
              );
            }, 0);
            this.actors = [];
            this.createMovieActorsArray(this.details.credits, this.actors);
          },
          (error) => {
            this.handleError(error);
          }
        );
      } else {
        this.http.getShowDetails(params.get('id')).subscribe(
          (res) => {
            this.details = res;
            this.setMetaTags();
            this.data.setVideoDetails(this.details);
            setTimeout(() => {
              this.setBackdropPath(
                `${this.backdropPath}${this.details.backdrop_path}`
              );
            }, 0);
            this.actors = [];
            this.createShowActorsArray(
              this.details.aggregate_credits,
              this.actors
            );
          },
          (error) => {
            this.handleError(error);
          }
        );
      }
    });
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
      : 'Informacje o filmach, serialach, ich twórcach i aktorach, kodi nfo generator';
    const imgPath: string = this.details.poster_path
      ? this.photoPath + this.details.poster_path
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
    if (this.details && this.details.backdrop_path) {
      this.data.setBackdropPath(path);
    } else {
      this.data.setBackdropPath(this.defaultBackdropPath);
    }
  }

  createMovieActorsArray(input, output: Array<VideoActor>) {
    for (let actor of input.cast) {
      if (actor.character.toLowerCase().includes('self')) {
        actor.character = actor.name;
      }
      output.push(actor);
    }
  }

  createShowActorsArray(input, output: Array<VideoActor>) {
    let character: Array<string>;

    for (let actor of input.cast) {
      character = [];
      for (let role of actor.roles) {
        if (role.character.toLowerCase().includes('self')) {
          role.character = actor.name;
        }
        character.push(role.character);
      }
      actor.character = character.join(' / ');
      output.push(actor);
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

  goBack() {
    this.location.back();
  }
}
