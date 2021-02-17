import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import {
  MovieActor,
  MovieCertification,
  MovieCrew,
  MovieDetails,
} from 'src/app/models/movie-details';
import { ToTranslate } from 'src/app/models/google-translation';
import { GtranslateService } from 'src/app/services/gtranslate.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movieDetails: MovieDetails;
  movieDetailsEn: MovieDetails;
  overviewEn: string;
  overviewTranslated: string;
  buttonOn: boolean = true;
  posterPath: string;
  backdropPath: string;
  screenwriters: Array<MovieCrew> = [];
  directors: Array<MovieCrew> = [];
  numberOfActorsInArray: number = 9;
  actors: Array<MovieActor> = [];
  certifications: Array<MovieCertification> = [];
  imdbRating: number;
  imdbRatingCount: number;
  kodiNfo: string;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private translator: GtranslateService
  ) {
    this.posterPath = this.http.urlImg94;
    this.backdropPath = this.http.urlImgOriginal;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // polish details
      this.http.getMovieDetails(params.get('id')).subscribe(
        (res) => {
          console.log('Details: ', res);
          this.movieDetails = res;
          this.createScreenwritersArray(
            this.movieDetails.credits,
            this.screenwriters
          );
          this.createDirectorsArray(this.movieDetails.credits, this.directors);
          this.createActorsArray(
            this.movieDetails.credits,
            this.actors,
            this.numberOfActorsInArray
          );
          this.createCertificationsArray(
            this.movieDetails.release_dates,
            this.certifications
          );

          // english details
          if (!this.movieDetails.overview) {
            this.http.getMovieDetails(params.get('id'), 'en').subscribe(
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

  createScreenwritersArray(input, output: Array<MovieCrew>) {
    for (let el of input.crew) {
      if (el.job.toLowerCase() === 'screenplay') {
        output.push(el);
      }
    }
  }

  createDirectorsArray(input, output: Array<MovieCrew>) {
    for (let el of input.crew) {
      if (el.job.toLowerCase() === 'director') {
        output.push(el);
      }
    }
  }

  createActorsArray(input, output: Array<MovieActor>, outputLength: number) {
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

  createCertificationsArray(input, output: Array<MovieCertification>) {
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
    <movie>
        <title>${this.movieDetails.title}</title>
        <originaltitle>${this.movieDetails.original_title}</originaltitle>
        <ratings>
            <rating name="imdb" max="10" default="true">
                <value>${this.imdbRating ? this.imdbRating : ''}</value>
                <votes>${
                  this.imdbRatingCount ? this.imdbRatingCount : ''
                }</votes>
            </rating>
            <rating name="themoviedb" max="10">
                <value>${this.movieDetails.vote_average}</value>
                <votes>${this.movieDetails.vote_count}</votes>
            </rating>
        </ratings>
        <userrating>0</userrating>
        <top250>0</top250>
        <outline></outline>
        <plot>${this.movieDetails.overview || this.overviewEn}</plot>
        <tagline>${this.movieDetails.tagline}</tagline>
        <runtime>${this.movieDetails.runtime}</runtime>
        ${this.getKodiNfoPosters()}
        <fanart>
        ${this.getKodiNfoBackdrops()}
        </fanart>
        <mpaa>${this.getKodiNfoMpaa()}</mpaa>
        <playcount>0</playcount>
        <lastplayed></lastplayed>
        <id>${this.movieDetails.id}</id>
        <uniqueid type="imdb">${
          this.movieDetails.external_ids.imdb_id
        }</uniqueid>
        <uniqueid type="tmdb" default="true">${this.movieDetails.id}</uniqueid>
        ${this.getKodiNfoGenres()}
        ${this.getKodiNfoCountries()}
        ${
          this.movieDetails.belongs_to_collection
            ? `
        <set>
          <name>${this.movieDetails.belongs_to_collection.name}</name>
          <overview></overview>
        </set> `
            : ''
        }
        ${this.getKodiNfoScreenwriters()}
        ${this.getKodiNfoDirectors()}
        <premiered>${this.movieDetails.release_date}</premiered>
        <year>${
          this.movieDetails.release_date
            ? this.movieDetails.release_date.slice(0, 4)
            : ''
        }</year>
        <status>${this.movieDetails.status}</status>
        ${this.getKodiNfoStudios()}
        ${this.getKodiNfoActors()}
        <resume>
            <position>0.000000</position>
            <total>0.000000</total>
        </resume>
        <dateadded>${this.getKodiNfoDate()}</dateadded>
    </movie>
    `;
  }

  getKodiNfoPosters(): string {
    const posters = this.movieDetails.images.posters;
    let kodiNfoPosters: string = '';

    if (posters.length > 0) {
      for (let poster of posters) {
        kodiNfoPosters += poster.file_path
          ? `<thumb aspect="poster" preview="https://image.tmdb.org/t/p/w500${poster.file_path}">https://image.tmdb.org/t/p/original${poster.file_path}</thumb>`
          : '';
      }
    } else {
      kodiNfoPosters += this.movieDetails.poster_path
        ? `<thumb aspect="poster" preview="https://image.tmdb.org/t/p/w500${this.movieDetails.poster_path}">https://image.tmdb.org/t/p/original${this.movieDetails.poster_path}</thumb>`
        : '';
    }
    return kodiNfoPosters;
  }

  getKodiNfoBackdrops(): string {
    const backdrops = this.movieDetails.images.backdrops;
    let kodiNfoBackdrops: string = '';

    if (backdrops.length > 0) {
      for (let backdrop of backdrops) {
        kodiNfoBackdrops += backdrop.file_path
          ? `<thumb dim="${backdrop.width}x${backdrop.height}" preview="https://image.tmdb.org/t/p/w780${backdrop.file_path}">https://image.tmdb.org/t/p/original${backdrop.file_path}</thumb>`
          : '';
      }
    } else {
      kodiNfoBackdrops += this.movieDetails.backdrop_path
        ? `<thumb preview="https://image.tmdb.org/t/p/w780${this.movieDetails.backdrop_path}">https://image.tmdb.org/t/p/original${this.movieDetails.backdrop_path}</thumb>`
        : '';
    }
    return kodiNfoBackdrops;
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
    const genres = this.movieDetails.genres;
    let kodiNfoGenres: string = '';

    if (genres.length > 0) {
      for (let genre of genres) {
        kodiNfoGenres += `<genre>${genre.name}</genre>`;
      }
    }

    return kodiNfoGenres || '<genre></genre>';
  }

  getKodiNfoCountries(): string {
    const countries = this.movieDetails.production_countries;
    let kodiNfoCountries: string = '';

    if (countries.length > 0) {
      for (let country of countries) {
        kodiNfoCountries += `<country>${country.name}</country>`;
      }
    }

    return kodiNfoCountries || '<country></country>';
  }

  getKodiNfoScreenwriters(): string {
    const screenwriters = this.screenwriters;
    let kodiNfoScreenwriters: string = '';

    if (screenwriters.length > 0) {
      for (let screenwriter of screenwriters) {
        kodiNfoScreenwriters += `<credits>${screenwriter.name}</credits>`;
      }
    }

    return kodiNfoScreenwriters || '<credits></credits>';
  }

  getKodiNfoDirectors(): string {
    const directors = this.directors;
    let kodiNfoDirectors: string = '';

    if (directors.length > 0) {
      for (let director of directors) {
        kodiNfoDirectors += `<director>${director.name}</director>`;
      }
    }

    return kodiNfoDirectors || '<director></director>';
  }

  getKodiNfoStudios(): string {
    const studios = this.movieDetails.production_companies;
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
      actors.forEach((actor: MovieActor, index: number) => {
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
