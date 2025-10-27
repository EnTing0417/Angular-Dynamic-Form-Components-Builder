import { Component, ChangeDetectionStrategy, input, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseControlValueAccessor } from '../../base-control';

@Component({
  selector: 'app-checkbox-input',
  template: `
    <div class="flex items-center mb-4">
      <input
        [id]="id()"
        type="checkbox"
        [checked]="value() ?? false"
        [disabled]="disabled()"
        (change)="onValueChange($event)"
        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        [class.border-red-500]="isInvalid()"
        [class.dark:border-red-400]="isInvalid()"
      />
      <label [for]="id()" class="ml-2 block text-sm text-gray-900 dark:text-gray-300"
        [class.text-red-600]="isInvalid()"
        [class.dark:text-red-500]="isInvalid()">
        {{ label() }}
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CheckboxInputComponent extends BaseControlValueAccessor<boolean> implements Validator {
  label = input.required<string>();
  id = input.required<string>();
  required = input(false, {
    transform: (value: boolean | string) => value === '' || value === true || value === 'true'
  });

  override writeValue(value: boolean | null): void {
    this.value.set(!!value);
  }

  onValueChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.value.set(checked);
    this.onChange(checked);
    this.onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required() && control.value !== true) {
      return { 'required': true };
    }
    return null;
  }
}