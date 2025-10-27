import { Component, ChangeDetectionStrategy, input, output, signal, WritableSignal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormField, TextField, TextareaField, CheckboxField, RadioField, PhoneField, AddressField, CheckboxGroupField } from '../../form-field.model';
import { TextInputComponent } from '../simple/text-input/text-input.component';
import { CheckboxInputComponent } from '../simple/checkbox-input/checkbox-input.component';

@Component({
  selector: 'app-property-panel',
  imports: [CommonModule, FormsModule, TextInputComponent, CheckboxInputComponent],
  template: `
    @if (editableField(); as field) {
      <div class="space-y-4 text-sm">
        <!-- Label / Legend -->
        @if (isTextField(field) || isTextareaField(field) || isCheckboxField(field)) {
          <app-text-input
            label="Label"
            id="prop-label"
            [(ngModel)]="field.label"
            (ngModelChange)="onPropertyChange()"
          ></app-text-input>
        }
        @if (isRadioField(field) || isPhoneField(field) || isAddressField(field) || isCheckboxGroupField(field)) {
          <app-text-input
            label="Legend"
            id="prop-legend"
            [(ngModel)]="field.legend"
            (ngModelChange)="onPropertyChange()"
          ></app-text-input>
        }

        <!-- Name / Model Property -->
        <app-text-input
          label="Name"
          id="prop-name"
          [(ngModel)]="field.name"
          (ngModelChange)="field.modelProperty = field.name; onPropertyChange()"
        ></app-text-input>
        <p class="text-xs text-gray-500 dark:text-gray-400 -mt-3 px-1">This unique name is used as the key in the form data.</p>

        <!-- Component-Specific Properties -->
        @if (isTextField(field)) {
          <app-text-input
            label="Type"
            id="prop-type"
            [(ngModel)]="field.type"
            (ngModelChange)="onPropertyChange()"
          ></app-text-input>
           <app-text-input
            label="Pattern (Regex)"
            id="prop-pattern"
            [(ngModel)]="field.pattern"
            (ngModelChange)="onPropertyChange()"
          ></app-text-input>
        }

        @if (isTextField(field) || isTextareaField(field)) {
            <app-text-input
              label="Placeholder"
              id="prop-placeholder"
              [(ngModel)]="field.placeholder"
              (ngModelChange)="onPropertyChange()"
            ></app-text-input>
        }

        @if (isRadioField(field) || isCheckboxGroupField(field)) {
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options</label>
            <div class="space-y-2">
              @for (option of field.options; let i = $index; track $index) {
                <div class="flex items-center gap-x-2">
                  <input type="text" [(ngModel)]="option.label" (ngModelChange)="onPropertyChange()" placeholder="Label" class="flex-1 w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                  <input type="text" [(ngModel)]="option.value" (ngModelChange)="onPropertyChange()" placeholder="Value" class="flex-1 w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                  <button type="button" (click)="removeOption(field, i)" class="p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove Option">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              }
            </div>
            <button type="button" (click)="addOption(field)" class="mt-2 w-full py-2 px-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors">
              Add Option
            </button>
          </div>
        }

        @if (isPhoneField(field)) {
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">Subfield Labels</h3>
            <app-text-input
              label="Country Code Label"
              id="prop-phone-code-label"
              [(ngModel)]="field.countryCodeLabel"
              (ngModelChange)="onPropertyChange()"
            ></app-text-input>
            <app-text-input
              label="Number Label"
              id="prop-phone-number-label"
              [(ngModel)]="field.numberLabel"
              (ngModelChange)="onPropertyChange()"
            ></app-text-input>
          </div>
        }

        @if (isAddressField(field)) {
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">Subfield Labels</h3>
            <app-text-input
              label="Street Label"
              id="prop-addr-street-label"
              [(ngModel)]="field.streetLabel"
              (ngModelChange)="onPropertyChange()"
            ></app-text-input>
            <app-text-input
              label="City Label"
              id="prop-addr-city-label"
              [(ngModel)]="field.cityLabel"
              (ngModelChange)="onPropertyChange()"
            ></app-text-input>
            <app-text-input
              label="State Label"
              id="prop-addr-state-label"
              [(ngModel)]="field.stateLabel"
              (ngModelChange)="onPropertyChange()"
            ></app-text-input>
            <app-text-input
              label="ZIP Code Label"
              id="prop-addr-zip-label"
              [(ngModel)]="field.zipLabel"
              (ngModelChange)="onPropertyChange()"
            ></app-text-input>
            <app-text-input
              label="Country Label"
              id="prop-addr-country-label"
              [(ngModel)]="field.countryLabel"
              (ngModelChange)="onPropertyChange()"
            ></app-text-input>
          </div>
        }
        
        <!-- Required Checkbox -->
        <div class="flex items-center">
            <input 
                type="checkbox" 
                id="prop-required"
                [ngModel]="field.required"
                (ngModelChange)="field.required = $event; onPropertyChange()"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">
            <label for="prop-required" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Required</label>
        </div>

      </div>
    } @else {
      <div class="text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <p class="text-sm text-gray-500 dark:text-gray-400">Select a field to see its properties.</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyPanelComponent {
  field = input<FormField | null>(null);
  fieldChange = output<FormField>();

  editableField: WritableSignal<FormField | null> = signal(null);

  constructor() {
    effect(() => {
      const currentField = this.field();
      // Deep copy for options array
      if (currentField && (this.isRadioField(currentField) || this.isCheckboxGroupField(currentField))) {
        this.editableField.set({ 
          ...currentField,
          options: currentField.options.map(o => ({...o}))
        });
      } else {
        this.editableField.set(currentField ? { ...currentField } : null);
      }
    }, { allowSignalWrites: true });
  }

  onPropertyChange(): void {
    const current = this.editableField();
    if (current) {
      this.fieldChange.emit(current);
    }
  }

  addOption(field: RadioField | CheckboxGroupField): void {
    const newOptionValue = `option_${field.options.length + 1}`;
    field.options.push({ label: 'New Option', value: newOptionValue });
    this.onPropertyChange();
  }

  removeOption(field: RadioField | CheckboxGroupField, index: number): void {
    field.options.splice(index, 1);
    this.onPropertyChange();
  }

  isTextField(field: FormField): field is TextField { return field.component === 'text'; }
  isTextareaField(field: FormField): field is TextareaField { return field.component === 'textarea'; }
  isCheckboxField(field: FormField): field is CheckboxField { return field.component === 'checkbox'; }
  isRadioField(field: FormField): field is RadioField { return field.component === 'radio'; }
  isPhoneField(field: FormField): field is PhoneField { return field.component === 'phone'; }
  isAddressField(field: FormField): field is AddressField { return field.component === 'address'; }
  isCheckboxGroupField(field: FormField): field is CheckboxGroupField { return field.component === 'checkbox-group'; }
}