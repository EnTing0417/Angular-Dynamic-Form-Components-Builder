import { Component, ChangeDetectionStrategy, input, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseControlValueAccessor } from '../../base-control';

@Component({
  selector: 'app-textarea-input',
  template: `
    <div class="mb-4">
      <label [for]="id()" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label() }}</label>
      <textarea
        [id]="id()"
        [placeholder]="placeholder()"
        [required]="required()"
        [value]="value() || ''"
        [disabled]="disabled()"
        (input)="onValueChange($event)"
        (blur)="onTouched()"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-gray-800 text-white placeholder-gray-400 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
        [rows]="rows()"
        [class]="isInvalid() 
          ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500' 
          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'"
      ></textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaInputComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TextareaInputComponent extends BaseControlValueAccessor<string> {
  label = input.required<string>();
  id = input.required<string>();
  placeholder = input<string>('');
  required = input<boolean>(false);
  rows = input<number>(3);
  
  onValueChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value.set(value);
    this.onChange(value);
  }
}