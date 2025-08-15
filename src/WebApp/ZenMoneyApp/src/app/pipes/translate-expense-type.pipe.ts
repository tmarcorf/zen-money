import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'translateExpenseType',
  standalone: false
})
export class TranslateExpenseTypePipe implements PipeTransform {
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