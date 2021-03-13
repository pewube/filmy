import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { VideoImage } from 'src/app/models/video-details';

@Component({
  selector: 'app-photo-panel',
  templateUrl: './photo-panel.component.html',
  styleUrls: ['./photo-panel.component.scss'],
})
export class PhotoPanelComponent implements OnChanges {
  @Input() sourceArray: Array<Partial<VideoImage>>;
  @Input() title: string;
  @Input() photoPath: string;
  @Input() imgWidth: string = '94px';
  @Input() imgHeight: string = '141px';
  @Input() altImgDescription: string;
  @Output() enlarge = new EventEmitter<string>();
  @ViewChild('list') listToScroll: ElementRef;

  ngOnChanges(): void {
    if (this.listToScroll) {
      this.scrollElement();
    }
  }

  setWidth(): Object {
    return {
      width: this.imgWidth,
    };
  }
  setHeight(): Object {
    return {
      width: this.imgWidth,
      height: this.imgHeight,
    };
  }
  setWidthAndHeight(): Object {
    return {
      width: this.imgWidth,
      height: this.imgHeight,
    };
  }

  enlargePicture(path: string) {
    this.enlarge.emit(path);
  }

  scrollElement() {
    setTimeout(() => {
      this.listToScroll.nativeElement.scrollTo(0, 0);
    }, 0);
  }
}
