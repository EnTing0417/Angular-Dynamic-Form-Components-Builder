import { signal, WritableSignal, OnInit, inject, Injector, computed, Signal, input, ElementRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export abstract class BaseControlValueAccessor<T> implements ControlValueAccessor, OnInit {
  value: WritableSignal<T | null> = signal(null);
  disabled = signal(false);
  forceInvalid = input<boolean>(false);

  private injector = inject(Injector);
  private elementRef = inject(ElementRef);
  protected ngControl: NgControl | null = null;
  
  isRequired = signal(false);
  
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
    this.isRequired.set(this.elementRef.nativeElement.hasAttribute('required'));
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
