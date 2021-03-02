import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-nfo-content-dialog',
  templateUrl: './nfo-content-dialog.component.html',
  styleUrls: ['./nfo-content-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NfoContentDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { contentKodiNfo: string }
  ) {}
}
