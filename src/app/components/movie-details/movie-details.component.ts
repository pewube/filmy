import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MovieDetails } from 'src/app/models/movie-details';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  public movieDetails: MovieDetails;
  public posterPath: string;
  private movieCredits: Object;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.http.getMovieDetails(params.get('id')).subscribe(
        (res) => {
          console.log('Details: ', res);
          this.movieDetails = res;
          this.posterPath = this.http.urlImg94;
        },
        (error) => console.log('Błąd: ', error)
      );
      this.http.getMovieCredits(params.get('id')).subscribe(
        (res) => {
          this.movieCredits = res;
          console.log('Actors: ', this.movieCredits);
        },
        (error) => console.log('Błąd: ', error)
      );
    });
  }

  goToResults() {
    this.location.back();
  }
}
