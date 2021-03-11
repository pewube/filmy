import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  routeState: any;
  serverStatus: number;
  apiStatus: number;
  apiMessage: string;

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.routeState = this.router.getCurrentNavigation().extras.state;
      this.serverStatus = this.routeState.serverStatus;
      this.apiStatus = this.routeState.apiStatus;
      this.apiMessage = this.routeState.apiMessage;
    }
  }

  ngOnInit(): void {}
}