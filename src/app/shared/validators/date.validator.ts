import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DateValidator {
  static pastOrPresent(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();
      const inputDate = new Date(control.value);

      return inputDate > currentDate ? { futureDate: true } : null;
    };
  }
}
