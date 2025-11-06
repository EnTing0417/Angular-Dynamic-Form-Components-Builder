import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { AddressInputComponent, Address } from './address-input.component';

// Fix: Add declarations for jasmine globals to resolve TS errors
declare var describe: any;
declare var it: any;
declare var expect: any;
declare var beforeEach: any;

describe('AddressInputComponent Validator', () => {
  let component: AddressInputComponent;
  let control: FormControl<Address | null>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddressInputComponent],
    });
    // Create a dummy component instance just to access its validator method
    const fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    control = new FormControl(null);
  });

  describe('when required', () => {
    beforeEach(() => {
        // FIX: Mock the `required` input signal for testing the validator.
        // The original code had a typo ('isRequired') and tried to `.set()` an input signal, which is not allowed.
        (component as any).required = () => true;
    });

    it('should return {required: true} if value is null', () => {
      control.setValue(null);
      const errors = component.validate(control);
      expect(errors).toEqual({ required: true });
    });

    it('should return {required: true} if all fields are empty', () => {
      control.setValue({ street: '', city: '', state: '', zip: '', country: '' });
      const errors = component.validate(control);
      expect(errors).toEqual({ required: true });
    });

    it('should return specific errors if partially filled', () => {
      control.setValue({ street: '123 Main', city: '', state: 'CA', zip: '', country: '' });
      const errors = component.validate(control);
      expect(errors).toEqual({
        cityRequired: true,
        zipRequired: true,
        countryRequired: true,
      });
    });

    it('should return null if all fields are filled', () => {
      control.setValue({ street: '123 Main', city: 'Anytown', state: 'CA', zip: '12345', country: 'USA' });
      const errors = component.validate(control);
      expect(errors).toBeNull();
    });
  });

  describe('when optional', () => {
    beforeEach(() => {
        // FIX: Mock the `required` input signal for testing the validator.
        (component as any).required = () => false;
    });

    it('should return null if value is null', () => {
      control.setValue(null);
      const errors = component.validate(control);
      expect(errors).toBeNull();
    });

    it('should return null if all fields are empty', () => {
      control.setValue({ street: '', city: '', state: '', zip: '', country: '' });
      const errors = component.validate(control);
      expect(errors).toBeNull();
    });

    it('should return specific errors if partially filled', () => {
      // If the user starts filling an optional address, they must complete it
      control.setValue({ street: '123 Main', city: '', state: '', zip: '', country: '' });
      const errors = component.validate(control);
      expect(errors).toEqual({
        cityRequired: true,
        stateRequired: true,
        zipRequired: true,
        countryRequired: true,
      });
    });

    it('should return null if all fields are filled', () => {
      control.setValue({ street: '123 Main', city: 'Anytown', state: 'CA', zip: '12345', country: 'USA' });
      const errors = component.validate(control);
      expect(errors).toBeNull();
    });
  });
});
