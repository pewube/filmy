import {
  Certifications,
  RestrictionDeatils,
  Restrictions,
} from './../../../models/restrictions';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-restrictions-content-dialog',
  templateUrl: './restrictions-content-dialog.component.html',
  styleUrls: ['./restrictions-content-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RestrictionsContentDialogComponent implements OnInit {
  restrictions: Certifications;
  us: Array<RestrictionDeatils>;
  gb: Array<RestrictionDeatils>;
  fr: Array<RestrictionDeatils>;
  es: Array<RestrictionDeatils>;
  de: Array<RestrictionDeatils>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { isMovie: boolean },
    private http: HttpService
  ) {}

  ngOnInit(): void {
    if (this.data.isMovie) {
      this.http.getMoviesRestrictionsDetails().subscribe(
        (res) => {
          this.restrictions = res.certifications;
          this.us = res.certifications.US.sort((a, b) => a.order - b.order);
          this.gb = res.certifications.GB.sort((a, b) => a.order - b.order);
          this.fr = res.certifications.FR.sort((a, b) => a.order - b.order);
          this.es = res.certifications.ES.sort((a, b) => a.order - b.order);
          this.de = res.certifications.DE.sort((a, b) => a.order - b.order);
        },
        (error) => console.log('Błąd pobierania restrykcji dla movies: ', error)
      );
    } else {
      this.http.getShowsRestrictionsDetails().subscribe(
        (res) => {
          this.restrictions = res.certifications;
          this.us = res.certifications.US.sort((a, b) => a.order - b.order);
          this.gb = res.certifications.GB.sort((a, b) => a.order - b.order);
          this.fr = res.certifications.FR.sort((a, b) => a.order - b.order);
          this.es = res.certifications.ES.sort((a, b) => a.order - b.order);
          this.de = res.certifications.DE.sort((a, b) => a.order - b.order);
        },
        (error) =>
          console.log('Błąd pobierania restrykcji dla tvshows: ', error)
      );
    }
  }
}
