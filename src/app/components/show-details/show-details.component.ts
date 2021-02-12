import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ShowActor, ShowDetails } from 'src/app/models/show-details';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.scss'],
})
export class ShowDetailsComponent implements OnInit {
  showDetails: ShowDetails;
  showDetailsEn: ShowDetails;
  posterPath: string;
  backdropPath: string;
  private showCredits: Object;
  numberOfActorsInArray: number = 9;
  actors: Array<ShowActor> = [];

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
      this.http.getShowDetails(params.get('id')).subscribe(
        (res) => {
          console.log('Details: ', res);
          this.showDetails = res;
        },
        (error) => console.log('Błąd: ', error)
      );

      // english details
      this.http.getShowDetails(params.get('id'), 'en').subscribe(
        (res) => {
          this.showDetailsEn = res;
        },
        (error) => console.log('Błąd: ', error)
      );

      // cast and crew
      this.http.getShowCredits(params.get('id')).subscribe(
        (res) => {
          this.showCredits = res;
          console.log('Ekipa: ', this.showCredits);
          this.createActorsArray(
            this.showCredits,
            this.actors,
            this.numberOfActorsInArray
          );
          console.log('Aktorzy: ', this.actors);
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

  goToResults() {
    this.location.back();
  }
}
