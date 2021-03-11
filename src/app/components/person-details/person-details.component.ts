import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PersonDetails, PersonVideo } from 'src/app/models/person-details';
import { GtranslateService } from 'src/app/services/gtranslate.service';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';
import { ToTranslate } from 'src/app/models/google-translation';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss'],
})
export class PersonDetailsComponent implements OnInit {
  showLargePicture: boolean = false;
  posterPath: string;
  urlImg600: string;
  defaultPosterPath: string = 'assets/img/movie220.jpg';
  defaultBackdropPath: string = 'assets/img/popcorn1280.jpg';

  details: PersonDetails;
  biographyEn: string;
  biographyTranslated: string;
  videos: Array<Partial<PersonVideo>> = [];
  listVideos: Array<Partial<PersonVideo>> = [];
  buttonOn: boolean = true;

  checkedShows: boolean = true;
  checkedMovies: boolean = true;
  checkedDescend: boolean = true;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private translator: GtranslateService
  ) {
    this.urlImg600 = this.http.urlImg600;
    this.posterPath = this.http.urlImg220;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // polish person details
      this.http.getPersonDetails(params.get('id')).subscribe(
        (res) => {
          this.details = res;
          this.createVideoArray(res.combined_credits.cast, this.videos);
          this.listVideos = this.videos.sort((a, b) => {
            if (a.release_date > b.release_date) {
              return -1;
            }
            if (a.release_date < b.release_date) {
              return 1;
            }
            return 0;
          });

          // english movie details
          if (!this.details.biography) {
            this.http.getPersonDetails(params.get('id'), 'en').subscribe(
              (res) => {
                this.biographyEn = res.biography;
              },
              (error) =>
                console.log('Błąd pobierania details en dla person: ', error)
            );
            this.buttonOn = true;
          }
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
    });
    window.scrollTo(0, 0);
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

  // english overview translation
  translate(): void {
    const text: ToTranslate = {
      q: this.biographyEn,
      source: 'en',
      target: 'pl',
      format: 'text',
    };
    this.buttonOn = false;
    this.translator.translate(text).subscribe((result) => {
      this.biographyTranslated = result.data.translations[0].translatedText;
      this.biographyEn = this.biographyTranslated;
    }),
      (error) => console.log('Błąd tłumaczenia: ', error);
  }

  enlargePicture(): void {
    this.showLargePicture = true;
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
