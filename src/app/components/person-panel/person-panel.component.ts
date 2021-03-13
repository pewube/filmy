import { VideoActor, VideoCrew } from './../../models/video-details';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-person-panel',
  templateUrl: './person-panel.component.html',
  styleUrls: ['./person-panel.component.scss'],
})
export class PersonPanelComponent implements OnChanges {
  @Input() sourceArray: Array<Partial<VideoActor>> | Array<Partial<VideoCrew>>;
  @Input() title: string;
  @Input() photoPath: string;
  @Input() defaultPhotoPath: string = 'assets/img/cast94.jpg';
  @Input() routeUrl: string;
  @Input() imgWidth: string = '94px';
  @Input() imgHeight: string = '141px';
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

  scrollElement() {
    setTimeout(() => {
      this.listToScroll.nativeElement.scrollTo(0, 0);
    }, 0);
  }
}
