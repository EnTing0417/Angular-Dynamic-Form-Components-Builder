import { Component, ChangeDetectionStrategy, input, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseControlValueAccessor } from '../../base-control';
import { FormOption } from '../../../form-field.model';

@Component({
  selector: 'app-radio-group',
  template: `
    <fieldset class="mb-4">
      <legend class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        [class.text-red-600]="isInvalid()"
        [class.dark:text-red-500]="isInvalid()">{{ legend() }}</legend>
      <div class="space-y-2">
        @for (option of options(); track option.value) {
          <div class="flex items-center">
            <input
              [id]="name() + '-' + option.value"
              [name]="name()"
              type="radio"
              [value]="option.value"
              [checked]="value() === option.value"
              [disabled]="disabled()"
              (change)="onValueChange(option.value)"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label [for]="name() + '-' + option.value" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              {{ option.label }}
            </label>
          </div>
        }
      </div>
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RadioGroupComponent extends BaseControlValueAccessor<string> {
  legend = input.required<string>();
  name = input.required<string>();
  options = input.required<FormOption[]>();

  onValueChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }
}