import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyBr',
  standalone: false
})
export class CurrencyBrPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined) {
      return '';
    }

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue);
  }
}