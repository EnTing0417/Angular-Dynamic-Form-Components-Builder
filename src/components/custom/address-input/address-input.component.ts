import { Component, ChangeDetectionStrategy, forwardRef, ViewEncapsulation, computed, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseControlValueAccessor } from '../../base-control';
import { TextInputComponent } from '../../simple/text-input/text-input.component';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

@Component({
  selector: 'app-address-input',
  template: `
    <fieldset class="mb-4 border p-4 rounded-md"
      [class]="isInvalid() 
          ? 'border-red-500 dark:border-red-400' 
          : 'border-gray-300 dark:border-gray-600'">
      <legend class="text-sm font-medium px-2"
        [class]="isInvalid()
            ? 'text-red-600 dark:text-red-500'
            : 'text-gray-700 dark:text-gray-300'">
        {{ legend() }} @if(isRequired()) {<span class="text-red-500">*</span>}
      </legend>
      @if(value(); as address) {
        <div class="space-y-2">
          <app-text-input
            [label]="streetLabel()"
            id="street"
            [ngModel]="address.street"
            (ngModelChange)="updateField('street', $event)"
            (blur)="onTouched()"
            [disabled]="disabled()"
            [forceInvalid]="isStreetInvalid()"
          ></app-text-input>
          <app-text-input
            [label]="cityLabel()"
            id="city"
            [ngModel]="address.city"
            (ngModelChange)="updateField('city', $event)"
            (blur)="onTouched()"
            [disabled]="disabled()"
            [forceInvalid]="isCityInvalid()"
          ></app-text-input>
          <div class="flex space-x-2">
            <div class="w-1/2">
              <app-text-input
                [label]="stateLabel()"
                id="state"
                [ngModel]="address.state"
                (ngModelChange)="updateField('state', $event)"
                (blur)="onTouched()"
                [disabled]="disabled()"
                [forceInvalid]="isStateInvalid()"
              ></app-text-input>
            </div>
            <div class="w-1/2">
              <app-text-input
                [label]="zipLabel()"
                id="zip"
                [ngModel]="address.zip"
                (ngModelChange)="updateField('zip', $event)"
                (blur)="onTouched()"
                [disabled]="disabled()"
                [forceInvalid]="isZipInvalid()"
              ></app-text-input>
            </div>
          </div>
          <app-text-input
            [label]="countryLabel()"
            id="country"
            [ngModel]="address.country"
            (ngModelChange)="updateField('country', $event)"
            (blur)="onTouched()"
            [disabled]="disabled()"
            [forceInvalid]="isCountryInvalid()"
          ></app-text-input>
        </div>
      }
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TextInputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AddressInputComponent extends BaseControlValueAccessor<Address> implements Validator {
  legend = input<string>('Shipping Address');
  streetLabel = input<string>('Street');
  cityLabel = input<string>('City');
  stateLabel = input<string>('State');
  zipLabel = input<string>('ZIP Code');
  countryLabel = input<string>('Country');

  isStreetInvalid = computed(() => this.isInvalid() && !!this.ngControl?.errors?.['streetRequired']);
  isCityInvalid = computed(() => this.isInvalid() && !!this.ngControl?.errors?.['cityRequired']);
  isStateInvalid = computed(() => this.isInvalid() && !!this.ngControl?.errors?.['stateRequired']);
  isZipInvalid = computed(() => this.isInvalid() && !!this.ngControl?.errors?.['zipRequired']);
  isCountryInvalid = computed(() => this.isInvalid() && !!this.ngControl?.errors?.['countryRequired']);

  override writeValue(value: Address | null): void {
    super.writeValue(value ?? { street: '', city: '', state: '', zip: '', country: '' });
  }

  updateField(field: keyof Address, fieldValue: string): void {
    const currentAddress = this.value() || { street: '', city: '', state: '', zip: '', country: '' };
    const newAddress = { ...currentAddress, [field]: fieldValue };
    this.value.set(newAddress);
    
    const { street, city, state, zip, country } = newAddress;
    if (street || city || state || zip || country) {
      this.onChange(newAddress);
    } else {
      this.onChange(null);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as Address | null;
    if (!value) {
      return null;
    }

    const { street, city, state, zip, country } = value;
    // Only validate if at least one field is filled.
    if (!street && !city && !state && !zip && !country) {
      return null;
    }

    const errors: ValidationErrors = {};
    if (!street) errors['streetRequired'] = true;
    if (!city) errors['cityRequired'] = true;
    if (!state) errors['stateRequired'] = true;
    if (!zip) errors['zipRequired'] = true;
    if (!country) errors['countryRequired'] = true;
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
}