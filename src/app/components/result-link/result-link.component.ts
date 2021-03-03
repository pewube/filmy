import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-result-link',
  templateUrl: './result-link.component.html',
  styleUrls: ['./result-link.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResultLinkComponent implements OnInit {
  @Input() imgsrc: string;
  @Input() title: string;
  @Input() originalTitle: string;
  @Input() overview: string;
  @Input() date: string;

  defaultImgsrc: string = 'assets/img/movie150.jpg';

  constructor() {}

  ngOnInit(): void {}
}
