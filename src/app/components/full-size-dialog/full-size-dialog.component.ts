import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-full-size-dialog',
  templateUrl: './full-size-dialog.component.html',
  styleUrls: ['./full-size-dialog.component.scss'],
})
export class FullSizeDialogComponent implements OnInit {
  @Input() width: string;
  @Input() maxWidth: string;
  @Input() height: string;
  @Input() maxHeight: string;
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
      if (!this.maxWidth && !this.maxHeight) {
        return {
          width: this.width,
          'max-width': this.width,
          height: this.height,
          'max-height': this.height,
        };
      } else if (this.maxWidth && !this.maxHeight) {
        return {
          width: this.width,
          'max-width': this.maxWidth,
          height: this.height,
          'max-height': this.height,
        };
      } else if (this.maxHeight && !this.maxWidth) {
        return {
          width: this.width,
          'max-width': this.width,
          height: this.height,
          'max-height': this.maxHeight,
        };
      } else if (this.maxHeight && this.maxWidth) {
        return {
          width: this.width,
          'max-width': this.maxWidth,
          height: this.height,
          'max-height': this.maxHeight,
        };
      }
    } else {
      return {
        width: '0',
        'max-width': '0',
        height: '0',
        'max-height': '0',
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
