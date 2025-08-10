import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateFormatValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    let date: Date;

    // Se for string, tenta converter
    if (typeof control.value === 'string') {
      const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!datePattern.test(control.value)) {
        return { invalidFormat: { value: control.value } };
      }

      const [day, month, year] = control.value.split('/').map(Number);
      date = new Date(year, month - 1, day);
    }
    // Se já for Date
    else if (control.value instanceof Date && !isNaN(control.value.getTime())) {
      date = control.value;
    } else {
      return { invalidDate: { value: control.value } };
    }

    // Verifica se a data é válida
    if (
      date.getFullYear() < 1000 ||
      date.getMonth() < 0 || date.getMonth() > 11 ||
      date.getDate() < 1 || date.getDate() > 31
    ) {
      return { invalidDate: { value: control.value } };
    }

    return null;
  };
}