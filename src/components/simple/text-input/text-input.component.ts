import { Component, ChangeDetectionStrategy, input, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseControlValueAccessor } from '../../base-control';

@Component({
  selector: 'app-text-input',
  template: `
    <div class="mb-4">
      <label [for]="id()" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label() }}</label>
      <input
        [id]="id()"
        [type]="type()"
        [placeholder]="placeholder()"
        [required]="required()"
        [value]="value() || ''"
        [disabled]="disabled()"
        (input)="onValueChange($event)"
        (blur)="onTouched()"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-gray-800 text-white placeholder-gray-400 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
        [class]="isInvalid() 
          ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500' 
          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TextInputComponent extends BaseControlValueAccessor<string> {
  label = input.required<string>();
  id = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  
  // Re-declare inherited input to make it visible to the template compiler
  forceInvalid = input<boolean>(false);

  override writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  onValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }
}
