import { Pipe, PipeTransform } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';

@Pipe({
  name: 'minutesToHours',
})
export class MinutesToHoursPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 60) {
      return `${value} min.`;
    } else {
      const hours: number = Math.floor(value / 60);
      const minutes: number = value - hours * 60;
      return `${hours} godz. ${minutes} min.`;
    }
  }
}
