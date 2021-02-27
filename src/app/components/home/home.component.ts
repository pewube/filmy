import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TmdbResponse } from 'src/app/models/tmdb-response';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  movies: TmdbResponse;
  shows: TmdbResponse;
  urlImg150: string;
  urlImg130: string;
  urlImg94: string;

  constructor(private http: HttpService, private route: ActivatedRoute) {
    this.urlImg150 = this.http.urlImg150;
    this.urlImg130 = this.http.urlImg130;
    this.urlImg94 = this.http.urlImg94;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.http.getPopularMovies().subscribe((res) => (this.movies = res));
      this.http.getPopularShows().subscribe((res) => (this.shows = res));
    });
  }
}
