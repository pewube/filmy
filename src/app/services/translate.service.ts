import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  constructor() {}

  department(input: string): string {
    switch (input.toLowerCase()) {
      case 'acting':
        return 'obsada';
      case 'production':
        return 'produkcja';
      case 'editing':
        return 'montaż';
      case 'directing':
        return 'reżyseria';
      case 'writing':
        return 'scenariusz';
      case 'visual effects':
        return 'efekty specjalne';
      case 'crew':
        return 'ekipa';
      case 'actors':
        return 'obsada';
      case 'costume & make-up':
        return 'kostiumy i makijaż';
      case 'sound':
        return 'dźwięk';
      case 'lighting':
        return 'oświetlenie';
      case 'camera':
        return 'zdjęcia';
      case 'creator':
        return 'twórcy';
      default:
        return input.toLowerCase();
    }
  }

  videoStatus(input: string): string {
    switch (input.toLowerCase()) {
      case 'released':
        return 'wydany';
      case 'planned':
        return 'planowany';
      case 'canceled':
        return 'anulowany';
      case 'ended':
        return 'zakończony';
      case 'returning series':
        return 'planowany kolejny sezon';
      case 'post production':
        return 'w postprodukcji';
      case 'in production':
        return 'w produkcji';
      default:
        return input.toLowerCase();
    }
  }
}
