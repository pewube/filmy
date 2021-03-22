import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-full-size-dialog',
  templateUrl: './full-size-dialog.component.html',
  styleUrls: ['./full-size-dialog.component.scss'],
})
export class FullSizeDialogComponent implements OnInit {
  @Input() width: string;
  @Input() height: string;
  @Input() header: string;
  @Input() content: string;
  @Input() copyButtonOn: boolean = false;

  @Output() dialogOff = new EventEmitter<boolean>();

  isOn: boolean = false;
  isOff: boolean = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.isOn = true;
    }, 300);
  }

  setSize() {
    if (this.isOn) {
      return {
        width: this.width,
        height: this.height,
      };
    } else {
      return {
        width: '0',
        height: '0',
      };
    }
  }

  close() {
    this.isOn = false;
    this.isOff = true;
    setTimeout(() => {
      this.dialogOff.emit(true);
    }, 300);
  }
}
