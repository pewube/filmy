import { DataService } from './../../services/data.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  defaultBackdropPath: string;

  constructor(private http: HttpService, private data: DataService) {
    this.urlImg150 = this.http.urlImg150;
    this.defaultBackdropPath = this.data.defaultBackdropPath;
  }

  ngOnInit(): void {
    this.http.getPopularMovies().subscribe((res) => (this.movies = res));
    this.http.getPopularShows().subscribe((res) => (this.shows = res));
    setTimeout(() => {
      this.data.setBackdropPath(this.defaultBackdropPath);
    }, 0);
  }
}
