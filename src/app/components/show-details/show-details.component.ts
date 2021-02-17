import { ConfigService } from './../../services/config.service';
import { ToTranslate } from './../../models/google-translation';
import { GtranslateService } from './../../services/gtranslate.service';
import { HttpService } from './../../services/http.service';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import {
  ShowActor,
  ShowCertification,
  ShowDetails,
  ShowSeason,
} from 'src/app/models/show-details';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.scss'],
})
export class ShowDetailsComponent implements OnInit {
  showDetails: ShowDetails;
  overviewEn: string;
  overviewTranslated: string;
  buttonOn: boolean = true;
  posterPath: string;
  backdropPath: string;
  numberOfActorsInArray: number = 9;
  actors: Array<ShowActor> = [];
  seasons: Array<ShowSeason> = [];
  certifications: Array<ShowCertification> = [];
  imdbRating: number;
  imdbRatingCount: number;
  kodiNfo: string;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private translator: GtranslateService,
    private config: ConfigService
  ) {
    this.posterPath = this.http.urlImg94;
    this.backdropPath = this.http.urlImgOriginal;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // polish details
      this.http.getShowDetails(params.get('id')).subscribe(
        (res) => {
          console.log('Details: ', res);
          this.showDetails = res;
          this.createActorsArray(
            this.showDetails.credits,
            this.actors,
            this.numberOfActorsInArray
          );
          this.createCertificationsArray(
            this.showDetails.content_ratings,
            this.certifications
          );
          this.createSeasonsArray(this.showDetails.seasons, this.seasons);

          // english details
          if (!this.showDetails.overview) {
            this.http.getShowDetails(params.get('id'), 'en').subscribe(
              (res) => {
                this.overviewEn = res.overview;
              },
              (error) => console.log('Błąd: ', error)
            );
          }

          //imdb data
          this.http.getImdbData(res.external_ids.imdb_id).subscribe(
            (imdbData) => {
              this.imdbRating = imdbData.rating;
              this.imdbRatingCount = imdbData.ratingCount;
            },
            (error) => console.log('Błąd IMDB: ', error)
          );
        },
        (error) => console.log('Błąd: ', error)
      );
    });
  }

  createActorsArray(input, output: Array<ShowActor>, outputLength: number) {
    if (input.cast.length < outputLength) {
      for (let actor of input.cast) {
        output.push(actor);
      }
    } else {
      for (let i = 0; i < outputLength; i++) {
        output.push(input.cast[i]);
      }
    }
  }

  createSeasonsArray(input, output: Array<ShowSeason>) {
    if (input.length > 0) {
      for (let season of input) {
        output.push(season);
      }
    }
  }

  createCertificationsArray(input, output: Array<ShowCertification>) {
    for (let el of input.results) {
      if (
        el.iso_3166_1 === 'US' ||
        el.iso_3166_1 === 'DE' ||
        el.iso_3166_1 === 'GB' ||
        el.iso_3166_1 === 'FR' ||
        (el.iso_3166_1 === 'ES' && el.rating)
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

  goToResults() {
    this.location.back();
  }

  // create Kodi .nfo file

  showKodiNfo() {
    this.kodiNfo = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    <tvshow>
        <title>${this.showDetails.name}</title>
        <originaltitle>${this.showDetails.original_name}</originaltitle>
        <ratings>
            <rating name="imdb" max="10" default="true">
                <value>${this.imdbRating ? this.imdbRating : ''}</value>
                <votes>${
                  this.imdbRatingCount ? this.imdbRatingCount : ''
                }</votes>
            </rating>
            <rating name="themoviedb" max="10">
                <value>${this.showDetails.vote_average}</value>
                <votes>${this.showDetails.vote_count}</votes>
            </rating>
        </ratings>
        <userrating>0</userrating>
        <top250>0</top250>
        <season>${this.showDetails.number_of_seasons}</season>
        <episode>${this.showDetails.number_of_episodes}</episode>
        <displayseason>-1</displayseason>
        <displayepisode>-1</displayepisode>
        <outline></outline>
        <plot>${this.showDetails.overview || this.overviewEn}</plot>
        <tagline></tagline>
        <runtime>0</runtime>
        ${this.getKodiNfoPosters()}
        ${this.getKodiNfoSeasonsPosters()}
        <fanart>
        ${this.getKodiNfoBackdrops()}
        </fanart>
        <mpaa>${this.getKodiNfoMpaa()}</mpaa>
        <playcount>0</playcount>
        <lastplayed></lastplayed>
        <episodeguide>
            <url cache="tmdb-${
              this.showDetails.id
            }-pl.json">https://api.themoviedb.org/3/tv/${
      this.showDetails.id
    }?api_key=${this.config.getTmdbKey()}&amp;language=pl&amp;append_to_response=content_ratings,credits,external_ids,images&amp;include_image_language=pl,en,null</url>
        </episodeguide>
        <id>${this.showDetails.id}</id>
        <uniqueid type="imdb">${
          this.showDetails.external_ids.imdb_id
        }</uniqueid>
        <uniqueid type="tmdb" default="true">${this.showDetails.id}</uniqueid>
        <uniqueid type="tvdb">${
          this.showDetails.external_ids.tvdb_id
        }</uniqueid>
        ${this.getKodiNfoGenres()}
        <premiered>${this.showDetails.first_air_date}</premiered>
        <year>${
          this.showDetails.first_air_date
            ? this.showDetails.first_air_date.slice(0, 4)
            : ''
        }</year>
        <status>${this.showDetails.status}</status>
        ${this.getKodiNfoStudios()}
        ${this.getKodiNfoActors()}
        ${this.getKodiNfoSeasonsNames()}
        <resume>
            <position>0.000000</position>
            <total>0.000000</total>
        </resume>
        <dateadded>${this.getKodiNfoDate()}</dateadded>
    </tvshow>
      `;
  }

  getKodiNfoPosters(): string {
    const posters = this.showDetails.images.posters;
    let kodiNfoPosters: string = '';

    if (posters.length > 0) {
      for (let poster of posters) {
        kodiNfoPosters += poster.file_path
          ? `<thumb aspect="poster" preview="https://image.tmdb.org/t/p/w500${poster.file_path}">https://image.tmdb.org/t/p/original${poster.file_path}</thumb>`
          : '';
      }
    } else {
      kodiNfoPosters += this.showDetails.poster_path
        ? `<thumb aspect="poster" preview="https://image.tmdb.org/t/p/w500${this.showDetails.poster_path}">https://image.tmdb.org/t/p/original${this.showDetails.poster_path}</thumb>`
        : '';
    }
    return kodiNfoPosters;
  }

  getKodiNfoBackdrops(): string {
    const backdrops = this.showDetails.images.backdrops;
    let kodiNfoBackdrops: string = '';

    if (backdrops.length > 0) {
      for (let backdrop of backdrops) {
        kodiNfoBackdrops += backdrop.file_path
          ? `<thumb dim="${backdrop.width}x${backdrop.height}" preview="https://image.tmdb.org/t/p/w780${backdrop.file_path}">https://image.tmdb.org/t/p/original${backdrop.file_path}</thumb>`
          : '';
      }
    } else {
      kodiNfoBackdrops += this.showDetails.backdrop_path
        ? `<thumb preview="https://image.tmdb.org/t/p/w780${this.showDetails.backdrop_path}">https://image.tmdb.org/t/p/original${this.showDetails.backdrop_path}</thumb>`
        : '';
    }
    return kodiNfoBackdrops;
  }

  getKodiNfoSeasonsPosters(): string {
    const seasons = this.seasons;
    let kodiNfoSeasonsPosters: string = '';

    if (seasons.length > 0) {
      for (let season of seasons) {
        if (season.season_number > 0) {
          kodiNfoSeasonsPosters += season.poster_path
            ? `
          <thumb aspect="poster" type="season" season="${season.season_number}">https://image.tmdb.org/t/p/original${season.poster_path}</thumb>
          `
            : '';
        }
      }
    }

    return kodiNfoSeasonsPosters;
  }

  getKodiNfoMpaa(): string {
    const certifications = this.certifications;
    let kodiNfoMpaa: string;

    function findCountryCertificate(iso: string) {
      for (let el of certifications) {
        if (el.country === iso) {
          kodiNfoMpaa = `${el.certification} (${el.country})`;
          break;
        }
      }
    }

    if (certifications.length > 0) {
      findCountryCertificate('US');
      if (!kodiNfoMpaa) {
        findCountryCertificate('DE');
      }
      if (!kodiNfoMpaa) {
        findCountryCertificate('GB');
      }
      if (!kodiNfoMpaa) {
        findCountryCertificate('FR');
      }
      if (!kodiNfoMpaa) {
        findCountryCertificate('ES');
      }
    }

    return kodiNfoMpaa || '';
  }

  getKodiNfoGenres(): string {
    const genres = this.showDetails.genres;
    let kodiNfoGenres: string = '';

    if (genres.length > 0) {
      for (let genre of genres) {
        kodiNfoGenres += `<genre>${genre.name}</genre>`;
      }
    }

    return kodiNfoGenres || '<genre></genre>';
  }

  getKodiNfoStudios(): string {
    const studios = this.showDetails.networks;
    let kodiNfoStudios: string = '';

    if (studios.length > 0) {
      for (let studio of studios) {
        kodiNfoStudios += `<studio>${studio.name}</studio>`;
      }
    }

    return kodiNfoStudios || '<studio></studio>';
  }

  getKodiNfoActors(): string {
    const actors = this.actors;
    let kodiNfoActors: string = '';

    if (actors.length > 0) {
      actors.forEach((actor: ShowActor, index: number) => {
        kodiNfoActors += `
          <actor>
            <name>${actor.name}</name>
            <role>${actor.character}</role>
            <order>${index}</order>
            <thumb>${
              actor.profile_path
                ? 'https://image.tmdb.org/t/p/original' + actor.profile_path
                : ''
            }</thumb>
          </actor>
          `;
      });

      return kodiNfoActors || '';
    }
  }

  getKodiNfoSeasonsNames(): string {
    const seasons = this.seasons;
    let kodiNfoSeasonsNames: string = '';

    if (seasons.length > 0) {
      for (let season of seasons) {
        if (season.season_number > 0) {
          kodiNfoSeasonsNames += season.name
            ? `
            <namedseason number="${season.season_number}">${season.name}</namedseason>
          `
            : '';
        }
      }
    }

    return kodiNfoSeasonsNames || '';
  }

  getKodiNfoDate(): string {
    const date: Date = new Date();
    const year: string = date.toLocaleDateString('pl', { year: 'numeric' });
    const month: string = date.toLocaleDateString('pl', { month: '2-digit' });
    const day: string = date.toLocaleDateString('pl', { day: '2-digit' });
    const time: string = date.toLocaleTimeString();
    console.log(`${year}-${month}-${day} ${time}`);

    return `${year}-${month}-${day} ${time}`;
  }
}
