import {
  Certifications,
  RestrictionDeatils,
} from './../../../models/restrictions';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-restrictions-content-dialog',
  templateUrl: './restrictions-content-dialog.component.html',
  styleUrls: ['./restrictions-content-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RestrictionsContentDialogComponent implements OnInit {
  @Input() isMovie: boolean;
  restrictions: Certifications;
  us: Array<RestrictionDeatils>;
  gb: Array<RestrictionDeatils>;
  fr: Array<RestrictionDeatils>;
  es: Array<RestrictionDeatils>;
  de: Array<RestrictionDeatils>;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    if (this.isMovie) {
      this.http.getMoviesRestrictionsDetails().subscribe(
        (res) => {
          this.restrictions = res.certifications;
          this.us = res.certifications.US.sort((a, b) => a.order - b.order);
          this.gb = res.certifications.GB.sort((a, b) => a.order - b.order);
          this.fr = res.certifications.FR.sort((a, b) => a.order - b.order);
          this.es = res.certifications.ES.sort((a, b) => a.order - b.order);
          this.de = res.certifications.DE.sort((a, b) => a.order - b.order);
        },
        (error) => console.log('Movie restrictions error: ', error)
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
        (error) => console.log('TVShow restrictions error: ', error)
      );
    }
  }
}
