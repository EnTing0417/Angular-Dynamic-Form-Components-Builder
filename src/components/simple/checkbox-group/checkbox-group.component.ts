import { Component, ChangeDetectionStrategy, input, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseControlValueAccessor } from '../../base-control';
// FIX: Corrected the relative path to form-field.model.ts
import { FormOption } from '../../../form-field.model';

@Component({
  selector: 'app-checkbox-group',
  imports: [CommonModule],
  template: `
    <fieldset class="mb-4">
      <legend class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        [class.text-red-600]="isInvalid()"
        [class.dark:text-red-500]="isInvalid()">
          {{ legend() }} @if(required()) {<span class="text-red-500">*</span>}
      </legend>
      <div class="space-y-2">
        @for (option of options(); track option.value) {
          <div class="flex items-center">
            <input
              [id]="name() + '-' + option.value"
              [name]="name() + '-' + option.value"
              type="checkbox"
              [value]="option.value"
              [checked]="isChecked(option.value)"
              [disabled]="disabled()"
              (change)="onValueChange(option.value, $event)"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label [for]="name() + '-' + option.value" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              {{ option.label }}
            </label>
          </div>
        }
      </div>
    </fieldset>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CheckboxGroupComponent extends BaseControlValueAccessor<{[key: string]: boolean}> implements Validator {
  legend = input.required<string>();
  name = input.required<string>();
  options = input.required<FormOption[]>();

  override writeValue(value: {[key: string]: boolean} | null): void {
    this.value.set(value ?? {});
  }

  isChecked(optionValue: string): boolean {
    return this.value()?.[optionValue] ?? false;
  }

  onValueChange(optionValue: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentValue = { ...(this.value() ?? {}) };
    currentValue[optionValue] = isChecked;
    this.value.set(currentValue);
    this.onChange(currentValue);
    this.onTouched();
  }
  
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required()) {
      const value = control.value as {[key: string]: boolean} | null;
      if (!value || !Object.values(value).some(v => v === true)) {
        return { 'required': 'Please select at least one option.' };
      }
    }
    return null;
  }
}
