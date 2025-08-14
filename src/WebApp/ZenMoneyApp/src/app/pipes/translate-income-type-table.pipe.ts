import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateIncomeTypeTable',
  standalone: false
})
export class TranslateIncomeTypeTablePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Fixo';
      case 2:
        return 'Variável';
      default:
        return '';
    }
  }
}