import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import {
  MovieActor,
  MovieCrew,
  MovieDetails,
} from 'src/app/models/movie-details';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movieDetails: MovieDetails;
  movieDetailsEn: MovieDetails;
  posterPath: string;
  backdropPath: string;
  private movieCredits: Object;
  screenwriters: Array<MovieCrew> = [];
  directors: Array<MovieCrew> = [];
  numberOfActorsInArray: number = 9;
  actors: Array<MovieActor> = [];

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private location: Location
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
        },
        (error) => console.log('Błąd: ', error)
      );
      // english details
      this.http.getMovieDetails(params.get('id'), 'en').subscribe(
        (res) => {
          this.movieDetailsEn = res;
        },
        (error) => console.log('Błąd: ', error)
      );

      // cast and crew
      this.http.getMovieCredits(params.get('id')).subscribe(
        (res) => {
          this.movieCredits = res;
          console.log('Ekipa: ', this.movieCredits);
          this.createScreenwritersArray(this.movieCredits, this.screenwriters);
          this.createDirectorsArray(this.movieCredits, this.directors);
          this.createActorsArray(
            this.movieCredits,
            this.actors,
            this.numberOfActorsInArray
          );

          console.log('Scenarzyści: ', this.screenwriters);
          console.log('Rezyserzy: ', this.directors);
          console.log('Aktorzy: ', this.actors);
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

  goToResults() {
    this.location.back();
  }
}
