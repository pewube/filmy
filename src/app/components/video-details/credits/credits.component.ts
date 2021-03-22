import { VideoDetails } from './../../../models/video-details';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

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
  }

  ngOnInit(): void {
    this.detailsSubscription = this.data
      .getVideoDetails()
      .subscribe((details) => {
        if (details) {
          this.details = details;
          setTimeout(() => {
            this.setBackdropPath(
              `${this.backdropPath}${this.details.backdrop_path}`
            );
          }, 0);
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
      console.log(params);
      if (initialParameters[1] === 'movie') {
        this.http.getMovieDetails(params.get('id')).subscribe(
          (res) => {
            this.details = res;
            this.data.setVideoDetails(this.details);
            setTimeout(() => {
              this.setBackdropPath(
                `${this.backdropPath}${this.details.backdrop_path}`
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
            this.details = res;
            this.data.setVideoDetails(this.details);
            setTimeout(() => {
              this.setBackdropPath(
                `${this.backdropPath}${this.details.backdrop_path}`
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

  goBack() {
    this.location.back();
  }
}
