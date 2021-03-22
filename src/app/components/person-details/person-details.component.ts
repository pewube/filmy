import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PersonDetails, PersonVideo } from 'src/app/models/person-details';
import { GtranslateService } from 'src/app/services/gtranslate.service';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';
import { ToTranslate } from 'src/app/models/google-translation';
import { VideoImage } from 'src/app/models/video-details';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss'],
})
export class PersonDetailsComponent implements OnInit {
  showLargePicture: boolean = false;
  posterPath: string;
  profilePath: string;
  urlImg600: string;
  defaultBackdropPath: string;
  largePicturePath: string;

  details: PersonDetails;
  detailsEn: PersonDetails;
  detailsSubscription: Subscription;
  localDetails: PersonDetails;
  biographyTranslated: string;
  videos: Array<Partial<PersonVideo>> = [];
  listVideos: Array<Partial<PersonVideo>> = [];
  photos: Array<VideoImage> = [];
  numberOfItemsInArray: number = 165;
  buttonOn: boolean = true;

  checkedShows: boolean = true;
  checkedMovies: boolean = true;
  checkedDescend: boolean = true;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private translator: GtranslateService,
    private data: DataService
  ) {
    this.urlImg600 = this.http.urlImg600;
    this.posterPath = this.http.urlImg220;
    this.profilePath = this.http.urlImg94;
    this.defaultBackdropPath = this.data.defaultBackdropPath;
  }

  ngOnInit(): void {
    this.detailsSubscription = this.data
      .getPersonDetails()
      .subscribe((localDetails) => {
        this.localDetails = localDetails;
      });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getData(params.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.detailsSubscription.unsubscribe();
  }

  getData(personId: string) {
    if (this.localDetails && this.localDetails.id.toString() === personId) {
      this.details = this.localDetails;
      this.processData();
    } else {
      this.http.getPersonDetails(personId).subscribe(
        (res) => {
          this.details = res;
          this.processData();
          // console.log('Person details: ', res);
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  processData() {
    this.data.setPersonDetails(this.details);

    this.videos = [];
    this.createVideoArray(this.details.combined_credits.cast, this.videos);
    this.listVideos = this.videos.sort((a, b) => {
      if (a.release_date > b.release_date) {
        return -1;
      }
      if (a.release_date < b.release_date) {
        return 1;
      }
      return 0;
    });

    this.photos = [];
    this.createPhotosArray(
      this.details.images,
      this.photos,
      this.numberOfItemsInArray
    );

    if (!this.details.biography) {
      this.http
        .getPersonDetails(this.route.snapshot.paramMap.get('id'), 'en')
        .subscribe(
          (res) => {
            this.detailsEn = res;
          },
          (error) =>
            console.log('Błąd pobierania details en dla person: ', error)
        );
      this.buttonOn = true;
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
      this.data.setBackdropPath(this.defaultBackdropPath);
    }, 0);
  }

  createVideoArray(input, output: Array<Partial<PersonVideo>>): void {
    for (let video of input) {
      if (video.character && video.character.toLowerCase().includes('self')) {
        video.character = this.details.name;
      }

      if (!video.release_date && !video.first_air_date) {
        video.first_air_date = '-';
      }

      const videoSummary = {
        release_date: video.release_date
          ? video.release_date
          : video.first_air_date,
        title: video.title ? video.title : video.name,
        character: video.character,
        id: video.id,
        media_type: video.media_type,
        episode_count: video.episode_count,
      };

      output.push(videoSummary);
    }
  }

  createPhotosArray(
    input,
    output: Array<VideoImage>,
    outputLength: number = 8
  ) {
    if (input.profiles.length < outputLength) {
      for (let photo of input.profiles) {
        output.push(photo);
      }
    } else {
      for (let i = 0; i < outputLength; i++) {
        output.push(input.profiles[i]);
      }
    }
  }

  // english overview translation
  translate(): void {
    const text: ToTranslate = {
      q: this.detailsEn.biography,
      source: 'en',
      target: 'pl',
      format: 'text',
    };
    this.buttonOn = false;
    this.translator.translate(text).subscribe((result) => {
      this.biographyTranslated = result.data.translations[0].translatedText;
      this.detailsEn.biography = this.biographyTranslated;
    }),
      (error) => console.log('Błąd tłumaczenia: ', error);
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
  }

  closeLargePicture(event): void {
    this.showLargePicture = !event;
  }

  toggleVideos() {
    this.listVideos = [];
    if (this.checkedMovies && this.checkedShows) {
      this.listVideos = this.videos.filter((video) => video);
    } else if (this.checkedMovies && !this.checkedShows) {
      this.listVideos = this.videos.filter(
        (video) => video.media_type === 'movie'
      );
    } else if (!this.checkedMovies && this.checkedShows) {
      this.listVideos = this.videos.filter(
        (video) => video.media_type === 'tv'
      );
    }

    switch (this.checkedDescend) {
      case true:
        this.listVideos.sort((a, b) => {
          if (a.release_date > b.release_date) {
            return -1;
          }
          if (a.release_date < b.release_date) {
            return 1;
          }
          return 0;
        });
        break;
      case false:
        this.listVideos.sort((a, b) => {
          if (a.release_date > b.release_date) {
            return 1;
          }
          if (a.release_date < b.release_date) {
            return -1;
          }
          return 0;
        });
        break;
    }
  }

  goToResults() {
    this.location.back();
  }
}
