import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrencyPipe',
  standalone: false
})
export class FormtCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    return `R$ ${value}`;
  }
}