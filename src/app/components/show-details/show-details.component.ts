import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.scss'],
})
export class ShowDetailsComponent implements OnInit {
  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('id'));
    const id = this.route.snapshot.paramMap.get('id');

    this.http.getShowDetails(id).subscribe(
      (showDetails) => {
        console.log(showDetails);
      },
      (error) => console.log('Błąd: ', error)
    );
  }

  // goToMovies() {
  //   // this.router.navigate(['/movies']);
  //   this.location.back();
  // }
}
