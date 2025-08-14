import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateIncomeType',
  standalone: false
})
export class TranslateIncomeTypePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Fixed':
        return 'Fixo';
      case 'Variable':
        return 'Variável';
      default:
        return value;
    }
  }
}