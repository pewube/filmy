import { ConfigService } from './config.service';
import { ToTranslate } from './../models/google-translation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GtranslateService {
  private key = this.config.getGoogleKey();
  urlTranslate: string =
    'https://translation.googleapis.com/language/translate/v2?key=';

  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  translate(text: ToTranslate) {
    return this.httpClient.post<ToTranslate>(
      this.urlTranslate + this.key,
      text
    );
  }
}
