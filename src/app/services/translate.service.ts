import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  constructor() {}

  department(word: string): string {
    switch (word.toLowerCase()) {
      case 'acting':
        return 'obsada';
        break;
      case 'production':
        return 'produkcja';
        break;
      case 'editing':
        return 'montaż';
        break;
      case 'directing':
        return 'reżyseria';
        break;
      case 'writing':
        return 'scenariusz';
        break;
      case 'visual effects':
        return 'efekty specjalne';
        break;
      case 'crew':
        return 'ekipa';
        break;
      case 'actors':
        return 'obsada';
        break;
      case 'costume & make-up':
        return 'kostiumy i makijaż';
        break;
      case 'sound':
        return 'dźwięk';
        break;
      case 'lighting':
        return 'oświetlenie';
        break;
      case 'camera':
        return 'zdjęcia';
        break;
      case 'creator':
        return 'twórcy';
        break;
      default:
        return word.toLowerCase();
    }
  }
}
