export interface ToTranslate {
  q: string;
  source: string;
  target: string;
  format: string;
  data?: Translation;
}

export interface Translation {
  translations: TranslatedText;
}

export interface TranslatedText {
  translatedText: string;
}
