import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PersonDetails } from 'src/app/models/person-details';
import { VideoDetails } from 'src/app/models/video-details';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';
import { OnDestroy } from '@angular/core';

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
    private router: Router
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
          this.data.setPersonDetails(this.detailsPerson);
        },
        (error) => {
          this.handleError(error);
        }
      );
    });
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
        return 'Obrazy';
        break;
    }
  }

  enlargePicture(path: string) {
    this.showLargePicture = true;
    this.largePicturePath = path;
  }

  closeLargePicture(event): void {
    this.showLargePicture = !event;
  }

  goBack() {
    this.location.back();
  }
}
