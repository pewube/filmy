import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-full-size-picture',
  templateUrl: './full-size-picture.component.html',
  styleUrls: ['./full-size-picture.component.scss'],
})
export class FullSizePictureComponent implements OnInit {
  @Input() path: string;
  @Input() title: string;
  @Output() closeLargePicture = new EventEmitter<boolean>();

  isOn: boolean = false;
  isOff: boolean = false;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isOn = true;
    }, 300);
  }

  close() {
    this.isOn = false;
    this.isOff = true;
    setTimeout(() => {
      this.closeLargePicture.emit(true);
    }, 300);
  }
}
