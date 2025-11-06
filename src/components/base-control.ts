import { Directive } from '@angular/core';
import { signal, WritableSignal, OnInit, inject, Injector, computed, Signal, input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive()
export abstract class BaseControlValueAccessor<T> implements ControlValueAccessor, OnInit {
  value: WritableSignal<T | null> = signal(null);
  disabled = signal(false);
  forceInvalid = input<boolean>(false);
  required = input(false, {
    transform: (value: boolean | string) => value === '' || value === true || value === 'true'
  });

  private injector = inject(Injector);
  protected ngControl: NgControl | null = null;
  
  isInvalid: Signal<boolean> = computed(() => {
    if (this.forceInvalid()) {
      return true;
    }
    if (!this.ngControl?.control) {
      return false;
    }
    const { invalid, touched, dirty } = this.ngControl.control;
    return !!(invalid && (touched || dirty));
  });

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
  }

  onChange: (value: T | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}