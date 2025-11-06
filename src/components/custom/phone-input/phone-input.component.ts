import { Component, ChangeDetectionStrategy, forwardRef, ViewEncapsulation, computed, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseControlValueAccessor } from '../../base-control';
import { TextInputComponent } from '../../simple/text-input/text-input.component';

export interface Phone {
  countryCode: string;
  number: string;
}

@Component({
  selector: 'app-phone-input',
  template: `
    <fieldset class="mb-4 border p-4 rounded-md"
      [class]="isInvalid() 
          ? 'border-red-500 dark:border-red-400' 
          : 'border-gray-300 dark:border-gray-600'">
      <legend class="text-sm font-medium px-2"
        [class]="isInvalid()
            ? 'text-red-600 dark:text-red-500'
            : 'text-gray-700 dark:text-gray-300'">
        {{ legend() }} @if(required()) {<span class="text-red-500">*</span>}
      </legend>
      @if(value(); as phone) {
        <div class="flex space-x-2">
          <div class="w-1/4">
            <label for="countryCode" class="block text-sm font-medium mb-1"
             [class]="isCodeInvalid() ? 'text-red-600 dark:text-red-500' : 'text-gray-700 dark:text-gray-300'">{{ countryCodeLabel() }}</label>
            <input
              id="countryCode"
              type="text"
              [ngModel]="phone.countryCode"
              (ngModelChange)="updateField('countryCode', $event)"
              (blur)="onTouched()"
              [disabled]="disabled()"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-gray-800 text-white dark:bg-gray-700 dark:text-white"
              [class]="isCodeInvalid() 
                ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'"
            />
          </div>
          <div class="w-3/4">
            <app-text-input
              [label]="numberLabel()"
              id="phoneNumber"
              [ngModel]="phone.number"
              (ngModelChange)="updateField('number', $event)"
              (blur)="onTouched()"
              [disabled]="disabled()"
              [forceInvalid]="isNumberInvalid()"
            ></app-text-input>
          </div>
        </div>
      }
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TextInputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PhoneInputComponent extends BaseControlValueAccessor<Phone> implements Validator {
  legend = input<string>('Phone');
  countryCodeLabel = input<string>('Code');
  numberLabel = input<string>('Number');

  isCodeInvalid = computed(() => this.isInvalid() && !!this.ngControl?.errors?.['codeRequired']);
  isNumberInvalid = computed(() => this.isInvalid() && !!this.ngControl?.errors?.['numberRequired']);

  override writeValue(value: Phone | null): void {
    super.writeValue(value ?? { countryCode: '+1', number: '' });
  }

  updateField(field: keyof Phone, fieldValue: string): void {
    const currentPhone = this.value() ?? { countryCode: '+1', number: '' };
    const newPhone = { ...currentPhone, [field]: fieldValue };
    this.value.set(newPhone);
    this.onChange(newPhone);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as Phone | null;
    
    if (!value || typeof value !== 'object') {
        return this.required() ? { required: true } : null;
    }
    
    const { countryCode, number } = value;
    const isAllEmpty = !countryCode && !number;

    if (isAllEmpty) {
      // If all fields are empty, it's a 'required' error only if the component is required.
      // If it's optional, it's valid (return null).
      return this.required() ? { required: true } : null;
    }

    // If it's not all empty (i.e., partially filled), all sub-fields become mandatory.
    const errors: ValidationErrors = {};
    if (!countryCode) errors['codeRequired'] = true;
    if (!number) errors['numberRequired'] = true;
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
}