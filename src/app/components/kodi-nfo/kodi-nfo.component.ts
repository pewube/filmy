import { ConfigService } from './../../services/config.service';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import {
  VideoActor,
  VideoCertification,
  VideoCrew,
  VideoDetails,
  VideoSeason,
} from 'src/app/models/video-details';

@Component({
  selector: 'app-kodi-nfo',
  templateUrl: './kodi-nfo.component.html',
  styleUrls: ['./kodi-nfo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KodiNfoComponent implements OnInit {
  @Input() details: VideoDetails;
  @Input() overviewEn: string;
  @Input() overviewTranslated: string;
  @Input() screenwriters: Array<VideoCrew> = [];
  @Input() directors: Array<VideoCrew> = [];
  @Input() actors: Array<VideoActor> = [];
  @Input() seasons: Array<VideoSeason> = [];
  @Input() certifications: Array<VideoCertification> = [];
  @Input() imdbRating: number;
  @Input() imdbVotes: number;
  @Input() statusTranslated: string;

  movieFlag: boolean;
  kodiNfo: string;

  showDialog: boolean = false;

  constructor(private location: Location, private config: ConfigService) {}

  ngOnInit(): void {
    this.switchData();
  }

  switchData() {
    const initialParameters: Array<string> = this.location.path().split(`/`);

    if (initialParameters[1] === 'movie') {
      this.movieFlag = true;
    } else {
      this.movieFlag = false;
    }
  }

  createKodiNfo() {
    const nfoCommonParts: Array<string> = [
      `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>`,
      `  <ratings>
        <rating name="imdb" max="10" default="true">
          <value>${this.imdbRating ? this.imdbRating : ''}</value>
          <votes>${this.imdbVotes ? this.imdbVotes : ''}</votes>
        </rating>
        <rating name="themoviedb" max="10">
          <value>${this.details.vote_average}</value>
          <votes>${this.details.vote_count}</votes>
        </rating>
      </ratings>
      <userrating>0</userrating>
      <top250>0</top250>`,
      `  <outline></outline>
      <plot>${this.details.overview || this.overviewEn}</plot>
      <tagline>${this.details.tagline}</tagline>`,
      `${this.getKodiNfoPosters()}`,
      `  <fanart>
      ${this.getKodiNfoBackdrops()}
      </fanart>
      <mpaa>${this.getKodiNfoMpaa()}</mpaa>
      <playcount>0</playcount>
      <lastplayed></lastplayed>`,
      `  <id>${this.details.id}</id>
      <uniqueid type="imdb">${this.details.external_ids.imdb_id}</uniqueid>
      <uniqueid type="tmdb" default="true">${this.details.id}</uniqueid>`,
      `   ${this.getKodiNfoGenres()}`,
      `  <status>${this.statusTranslated}</status>
          ${this.getKodiNfoStudios()}
          ${this.getKodiNfoActors()}`,
      `  <resume>
        <position>0.000000</position>
        <total>0.000000</total>
      </resume>
      <dateadded>${this.getKodiNfoDate()}</dateadded>`,
    ];

    const nfoShowParts: Array<string> = [
      `<tvshow>
      <title>${this.details.name}</title>
      <originaltitle>${this.details.original_name}</originaltitle>`,
      `  <season>${this.details.number_of_seasons}</season>
      <episode>${this.details.number_of_episodes}</episode>
      <displayseason>-1</displayseason>
      <displayepisode>-1</displayepisode>`,
      `  <runtime>0</runtime>`,
      ` ${this.getKodiNfoSeasonsPosters()}`,
      `  <episodeguide>
        <url cache="tmdb-${
          this.details.id
        }-pl.json">https://api.themoviedb.org/3/tv/${
        this.details.id
      }?api_key=${this.config.getTmdbKey()}&amp;language=pl&amp;append_to_response=content_ratings,credits,external_ids,images&amp;include_image_language=pl,en,null</url>
      </episodeguide>`,
      `  <uniqueid type="tvdb">${this.details.external_ids.tvdb_id}</uniqueid>`,
      `  <premiered>${this.details.first_air_date}</premiered>
      <year>${
        this.details.first_air_date
          ? this.details.first_air_date.slice(0, 4)
          : ''
      }</year>`,
      ` ${this.getKodiNfoSeasonsNames()}`,
      `</tvshow>`,
    ];

    const nfoMovieParts: Array<string> = [
      `<movie>
      <title>${this.details.title}</title>
      <originaltitle>${this.details.original_title}</originaltitle>`,
      `  <runtime>${this.details.runtime}</runtime>`,
      `${this.getKodiNfoCountries()}
    ${
      this.details.belongs_to_collection
        ? `
      <set>
        <name>${this.details.belongs_to_collection.name}</name>
        <overview></overview>
      </set> `
        : ''
    }
    ${this.getKodiNfoScreenwriters()}
    ${this.getKodiNfoDirectors()}`,
      `  <premiered>${this.details.release_date}</premiered>
      <year>${
        this.details.release_date ? this.details.release_date.slice(0, 4) : ''
      }</year>`,
      `</movie>`,
    ];

    this.kodiNfo = `${nfoCommonParts[0]}
    ${this.movieFlag ? nfoMovieParts[0] : nfoShowParts[0]}
    ${nfoCommonParts[1]}
    ${this.movieFlag ? '' : nfoShowParts[1]}
    ${nfoCommonParts[2]}
    ${this.movieFlag ? nfoMovieParts[1] : nfoShowParts[2]}
    ${nfoCommonParts[3]}
    ${this.movieFlag ? '' : nfoShowParts[3]}
    ${nfoCommonParts[4]}
    ${this.movieFlag ? '' : nfoShowParts[4]}
    ${nfoCommonParts[5]}
    ${this.movieFlag ? '' : nfoShowParts[5]}
    ${nfoCommonParts[6]}
    ${this.movieFlag ? nfoMovieParts[2] : ''}
    ${this.movieFlag ? nfoMovieParts[3] : nfoShowParts[6]}
    ${nfoCommonParts[7]}
    ${this.movieFlag ? '' : nfoShowParts[7]}
    ${nfoCommonParts[8]}
    ${this.movieFlag ? nfoMovieParts[4] : nfoShowParts[8]}
    `.replace(/^\s*\n/gm, '');
  }

  getKodiNfoPosters(): string {
    const posters = this.details.images.posters;
    let kodiNfoPosters: string = '';

    if (posters.length > 0) {
      for (const poster of posters) {
        kodiNfoPosters += poster.file_path
          ? `  <thumb aspect="poster" preview="https://image.tmdb.org/t/p/w500${poster.file_path}">https://image.tmdb.org/t/p/original${poster.file_path}</thumb>
    `
          : '';
      }
    } else {
      kodiNfoPosters += this.details.poster_path
        ? `  <thumb aspect="poster" preview="https://image.tmdb.org/t/p/w500${this.details.poster_path}">https://image.tmdb.org/t/p/original${this.details.poster_path}</thumb>
    `
        : '';
    }
    return kodiNfoPosters;
  }

  getKodiNfoSeasonsPosters(): string {
    const seasons = this.seasons;
    let kodiNfoSeasonsPosters: string = '';

    if (seasons.length > 0) {
      for (const season of seasons) {
        if (season.season_number > 0) {
          kodiNfoSeasonsPosters += season.poster_path
            ? ` <thumb aspect="poster" type="season" season="${season.season_number}">https://image.tmdb.org/t/p/original${season.poster_path}</thumb>
     `
            : '';
        }
      }
    }

    return kodiNfoSeasonsPosters;
  }

  getKodiNfoBackdrops(): string {
    const backdrops = this.details.images.backdrops;
    let kodiNfoBackdrops: string = '';

    if (backdrops.length > 0) {
      for (const backdrop of backdrops) {
        kodiNfoBackdrops += backdrop.file_path
          ? `  <thumb dim="${backdrop.width}x${backdrop.height}" preview="https://image.tmdb.org/t/p/w780${backdrop.file_path}">https://image.tmdb.org/t/p/original${backdrop.file_path}</thumb>
      `
          : '';
      }
    } else {
      kodiNfoBackdrops += this.details.backdrop_path
        ? ` <thumb preview="https://image.tmdb.org/t/p/w780${this.details.backdrop_path}">https://image.tmdb.org/t/p/original${this.details.backdrop_path}</thumb>
       `
        : '';
    }
    return kodiNfoBackdrops;
  }

  getKodiNfoMpaa(): string {
    const certifications = this.certifications;
    let kodiNfoMpaa: string;

    function findCountryCertificate(iso: string) {
      for (const el of certifications) {
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
    const genres = this.details.genres;
    let kodiNfoGenres: string = '';

    if (genres.length > 0) {
      for (const genre of genres) {
        kodiNfoGenres += `
      <genre>${genre.name}</genre>`;
      }
    }

    return kodiNfoGenres;
  }

  getKodiNfoCountries(): string {
    const countries = this.details.production_countries;
    let kodiNfoCountries: string = '';

    if (countries.length > 0) {
      for (const country of countries) {
        kodiNfoCountries += `
      <country>${country.name}</country>`;
      }
    }

    return kodiNfoCountries;
  }

  getKodiNfoScreenwriters(): string {
    const screenwriters = this.screenwriters;
    let kodiNfoScreenwriters: string = '';

    if (screenwriters.length > 0) {
      for (const screenwriter of screenwriters) {
        kodiNfoScreenwriters += `
      <credits>${screenwriter.name}</credits>`;
      }
    }

    return kodiNfoScreenwriters;
  }

  getKodiNfoDirectors(): string {
    const directors = this.directors;
    let kodiNfoDirectors: string = '';

    if (directors.length > 0) {
      for (const director of directors) {
        kodiNfoDirectors += `
      <director>${director.name}</director>`;
      }
    }

    return kodiNfoDirectors;
  }

  getKodiNfoStudios(): string {
    const studios = this.movieFlag
      ? this.details.production_companies
      : this.details.networks;
    let kodiNfoStudios: string = '';

    if (studios.length > 0) {
      for (const studio of studios) {
        kodiNfoStudios += `
      <studio>${studio.name}</studio>`;
      }
    }

    return kodiNfoStudios;
  }

  getKodiNfoActors(): string {
    const actors = this.actors.filter((el, i) => i < 11);
    let kodiNfoActors: string = '';

    if (actors.length > 0) {
      actors.forEach((actor: VideoActor, index: number) => {
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
      </actor>`;
      });

      return kodiNfoActors;
    }
  }

  getKodiNfoSeasonsNames(): string {
    const seasons = this.seasons;
    let kodiNfoSeasonsNames: string = '';

    if (seasons.length > 0) {
      for (const season of seasons) {
        if (season.season_number > 0) {
          kodiNfoSeasonsNames += season.name
            ? ` <namedseason number="${season.season_number}">${season.name}</namedseason>
     `
            : '';
        }
      }
    }

    return kodiNfoSeasonsNames;
  }

  getKodiNfoDate(): string {
    const date: Date = new Date();
    const year: string = date.toLocaleDateString('pl', { year: 'numeric' });
    const month: string = date.toLocaleDateString('pl', { month: '2-digit' });
    const day: string = date.toLocaleDateString('pl', { day: '2-digit' });
    const time: string = date.toLocaleTimeString();

    return `${year}-${month}-${day} ${time}`;
  }

  saveNfoFile() {
    this.createKodiNfo();
    const nfoContent: Blob = new Blob([this.kodiNfo], {
      type: 'text/plain;charset=utf-8',
    });
    const element: HTMLElement = window.document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(nfoContent));
    element.setAttribute(
      'download',
      `${this.movieFlag ? 'zmien-na-nazwe-pliku-z-filmem.nfo' : 'tvshow.nfo'}`
    );
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  dialogOn() {
    this.createKodiNfo();
    this.showDialog = true;
  }

  dialogOff(event) {
    this.showDialog = !event;
  }
}
