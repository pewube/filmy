import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  query: string;
  numberOfMovies: number;
  numberOfShows: number;

  constructor(
    private http: HttpService,
    private router: Router,
    private location: Location,
    private localData: DataService
  ) {}

  ngOnInit() {}

  reset(): void {
    this.query = null;
    this.numberOfMovies = null;
    this.numberOfShows = null;
  }
}
