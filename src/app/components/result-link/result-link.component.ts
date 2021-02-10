import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-link',
  templateUrl: './result-link.component.html',
  styleUrls: ['./result-link.component.scss'],
})
export class ResultLinkComponent implements OnInit {
  @Input() imgsrc: string;
  @Input() title: string;
  @Input() originalTitle: string;
  @Input() overview: string;
  @Input() date: string;

  constructor() {}

  ngOnInit(): void {}
}
