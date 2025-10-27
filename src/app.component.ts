import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { ThemeService } from './services/theme.service';
import { TextInputComponent } from './components/simple/text-input/text-input.component';
import { TextareaInputComponent } from './components/simple/textarea-input/textarea-input.component';
import { CheckboxInputComponent } from './components/simple/checkbox-input/checkbox-input.component';
import { RadioGroupComponent } from './components/simple/radio-group/radio-group.component';
import { CheckboxGroupComponent } from './components/simple/checkbox-group/checkbox-group.component';
import { AddressInputComponent, Address } from './components/custom/address-input/address-input.component';
import { PhoneInputComponent, Phone } from './components/custom/phone-input/phone-input.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';
import { FormField, AvailableField, FormOption } from './form-field.model';


@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    TextInputComponent,
    TextareaInputComponent,
    CheckboxInputComponent,
    RadioGroupComponent,
    CheckboxGroupComponent,
    AddressInputComponent,
    PhoneInputComponent,
    PropertyPanelComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  themeService = inject(ThemeService);

  private readonly planOptions: FormOption[] = [
    { value: 'free', label: 'Free' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];
  
  private readonly notificationOptions: FormOption[] = [
      { value: 'newsletter', label: 'Newsletter' },
      { value: 'productUpdates', label: 'Product Updates' },
      { value: 'promotions', label: 'Promotions' },
  ];

  private readonly initialFields: FormField[] = [
    { id: 'fullName', component: 'text', name: 'fullName', modelProperty: 'fullName', label: 'Full Name *', required: true },
    { id: 'email', component: 'text', name: 'email', modelProperty: 'email', label: 'Email *', type: 'email', required: true, pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$' },
    { id: 'phone', component: 'phone', name: 'phone', modelProperty: 'phone', legend: 'Phone *', countryCodeLabel: 'Code', numberLabel: 'Number', required: true },
    { id: 'shippingAddress', component: 'address', name: 'shippingAddress', modelProperty: 'shippingAddress', legend: 'Shipping Address *', streetLabel: 'Street', cityLabel: 'City', stateLabel: 'State', zipLabel: 'ZIP Code', countryLabel: 'Country', required: true },
    { id: 'bio', component: 'textarea', name: 'bio', modelProperty: 'bio', label: 'Your Bio', placeholder: 'Tell us a little about yourself...' },
    { id: 'plan', component: 'radio', name: 'plan', modelProperty: 'plan', legend: 'Choose a Plan *', options: this.planOptions, required: true },
    { id: 'notifications', component: 'checkbox-group', name: 'notifications', modelProperty: 'notifications', legend: 'Email Notifications', options: this.notificationOptions },
    { id: 'terms', component: 'checkbox', name: 'termsAccepted', modelProperty: 'termsAccepted', label: 'I accept the terms and conditions *', required: true }
  ];

  formFields = signal<FormField[]>(this.initialFields);
  userProfile = signal<{ [key: string]: any }>(this.getInitialUserProfile(this.initialFields));
  
  draggedFieldIndex = signal<number | null>(null);
  selectedFieldIndex = signal<number | null>(null);

  selectedField = computed(() => {
    const index = this.selectedFieldIndex();
    return index !== null ? this.formFields()[index] : null;
  });

  availableFields: AvailableField[] = [
    { type: 'text', label: 'Text Input', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12' },
    { type: 'textarea', label: 'Textarea', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' },
    { type: 'phone', label: 'Phone Input', icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z' },
    { type: 'address', label: 'Address Input', icon: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5-1.5-.5M5.25 7.5l3-1.091m0 4.868l3-1.091m0 4.868l3-1.091m0 4.868l3-1.091' },
    { type: 'radio', label: 'Radio Group', icon: 'M8.25 6.75h4.5M8.25 12h4.5m-4.5 5.25h4.5M3 6h.008v.008H3V6zm0 6h.008v.008H3v-.008zm0 6h.008v.008H3v-.008z' },
    { type: 'checkbox', label: 'Checkbox', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'checkbox-group', label: 'Checkbox Group', icon: 'M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125v-3.375c0-.621.504-1.125 1.125-1.125h1.5z M17.25 11.25l-3.75 3.75-1.5-1.5' }
  ];

  private getInitialUserProfile(fields: FormField[]): { [key: string]: any } {
    const profile: { [key: string]: any } = {};
    fields.forEach(field => {
      profile[field.modelProperty] = this.getInitialValueForField(field);
    });

    // Set default values for the initial form
    profile['fullName'] = 'Jane Doe';
    profile['email'] = 'test@example.com';
    profile['phone'] = { countryCode: '+60', number: '' };
    profile['shippingAddress'] = { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'USA' };
    profile['plan'] = 'monthly';
    profile['notifications'] = { newsletter: true, productUpdates: false, promotions: true };
    profile['termsAccepted'] = false;
    
    return profile;
  }

  private getInitialValueForField(field: FormField): any {
    switch (field.component) {
      case 'phone': return { countryCode: '+1', number: '' };
      case 'address': return { street: '', city: '', state: '', zip: '', country: '' };
      case 'checkbox': return false;
      case 'checkbox-group': return {};
      default: return '';
    }
  }

  private createFieldConfig(fieldType: FormField['component']): FormField {
    const timestamp = Date.now();
    const uniqueId = `${fieldType}_${timestamp}`;

    switch (fieldType) {
      case 'text':
        return { id: uniqueId, component: 'text', name: uniqueId, modelProperty: uniqueId, label: 'New Text Field', type: 'text' };
      case 'textarea':
        return { id: uniqueId, component: 'textarea', name: uniqueId, modelProperty: uniqueId, label: 'New Text Area', placeholder: 'Enter text here...' };
      case 'phone':
        return { id: uniqueId, component: 'phone', name: uniqueId, modelProperty: uniqueId, legend: 'New Phone Field', countryCodeLabel: 'Code', numberLabel: 'Number' };
      case 'address':
        return { id: uniqueId, component: 'address', name: uniqueId, modelProperty: uniqueId, legend: 'New Address Field', streetLabel: 'Street', cityLabel: 'City', stateLabel: 'State', zipLabel: 'ZIP Code', countryLabel: 'Country' };
      case 'radio':
        return { id: uniqueId, component: 'radio', name: uniqueId, modelProperty: uniqueId, legend: 'New Radio Group', options: [{value: 'opt1', label: 'Option 1'}, {value: 'opt2', label: 'Option 2'}] };
      case 'checkbox':
        return { id: uniqueId, component: 'checkbox', name: uniqueId, modelProperty: uniqueId, label: 'New Checkbox' };
      case 'checkbox-group':
        return { id: uniqueId, component: 'checkbox-group', name: uniqueId, modelProperty: uniqueId, legend: 'New Checkbox Group', options: [{value: 'opt1', label: 'Option 1'}, {value: 'opt2', label: 'Option 2'}] };
      default:
        throw new Error(`Unknown field type: ${fieldType}`);
    }
  }
  
  getLabel(field: FormField): string {
    if ('label' in field && field.label) {
        return field.label.replace(' *', '');
    }
    if ('legend' in field && field.legend) {
        return field.legend.replace(' *', '');
    }
    switch (field.component) {
        case 'phone': return 'Phone';
        case 'address': return 'Shipping Address';
        default: return 'This field';
    }
  }
  
  deleteField(index: number): void {
    if (this.selectedFieldIndex() === index) {
      this.selectedFieldIndex.set(null);
    }
    const fieldToDelete = this.formFields()[index];
    this.formFields.update(fields => {
      fields.splice(index, 1);
      return [...fields];
    });
    this.userProfile.update(profile => {
      delete profile[fieldToDelete.modelProperty];
      return {...profile};
    });
  }

  updateField(updatedField: FormField): void {
    const index = this.selectedFieldIndex();
    if (index === null) return;

    const oldField = this.formFields()[index];

    if (oldField.modelProperty !== updatedField.modelProperty) {
      this.userProfile.update(profile => {
        if (Object.prototype.hasOwnProperty.call(profile, oldField.modelProperty)) {
          const newProfile = { ...profile };
          newProfile[updatedField.modelProperty] = newProfile[oldField.modelProperty];
          delete newProfile[oldField.modelProperty];
          return newProfile;
        }
        return profile;
      });
    }

    this.formFields.update(fields => {
      const newFields = [...fields];
      newFields[index] = updatedField;
      return newFields;
    });
  }

  selectField(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedFieldIndex.set(index);
  }

  onModelChange(property: string, value: any): void {
    this.userProfile.update(profile => ({
      ...profile,
      [property]: value
    }));
  }
  
  onSubmit(form: NgForm): void {
    console.log('Form Submitted!');
    console.log('Is form valid:', form.valid);
    console.log('Form value:', form.value);
  }

  resetForm(form: NgForm): void {
    this.formFields.set(this.initialFields);
    const initialProfile = this.getInitialUserProfile(this.initialFields);
    this.userProfile.set(initialProfile);
    this.selectedFieldIndex.set(null);
    form.resetForm(initialProfile);
  }

  // --- Drag and Drop Handlers ---

  onPaletteDragStart(event: DragEvent, fieldType: FormField['component']): void {
    event.dataTransfer?.setData('action', 'add-field');
    event.dataTransfer?.setData('fieldType', fieldType);
  }

  onFieldDragStart(event: DragEvent, index: number): void {
    this.draggedFieldIndex.set(index);
    if (this.selectedFieldIndex() === index) {
      this.selectedFieldIndex.set(null);
    }
    event.dataTransfer?.setData('action', 'move-field');
    event.dataTransfer?.setData('fieldIndex', index.toString());
    const draggableEl = (event.target as HTMLElement).closest('.draggable-field');
    if (draggableEl) {
      (draggableEl as HTMLElement).style.opacity = '0.5';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragEnter(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.draggedFieldIndex() === index) return;
    const targetElement = (event.target as HTMLElement).closest('.draggable-field');
    if (targetElement) {
        targetElement.classList.add('drag-over');
    }
  }

  onDragLeave(event: DragEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    const targetElement = (event.target as HTMLElement).closest('.draggable-field');
    if (targetElement && !targetElement.contains(relatedTarget)) {
      targetElement.classList.remove('drag-over');
    }
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    const action = event.dataTransfer?.getData('action');

    if (action === 'move-field') {
      const draggedIndex = this.draggedFieldIndex();
      if (draggedIndex !== null && draggedIndex !== dropIndex) {
        this.formFields.update(fields => {
          const newFields = [...fields];
          const [draggedItem] = newFields.splice(draggedIndex, 1);
          newFields.splice(dropIndex, 0, draggedItem);
          return newFields;
        });
      }
    } else if (action === 'add-field') {
      const fieldType = event.dataTransfer?.getData('fieldType') as FormField['component'];
      if (fieldType) {
        const newField = this.createFieldConfig(fieldType);
        this.formFields.update(fields => {
          const newFields = [...fields];
          newFields.splice(dropIndex, 0, newField);
          return newFields;
        });
        this.userProfile.update(profile => {
          profile[newField.modelProperty] = this.getInitialValueForField(newField);
          return {...profile};
        });
      }
    }
    
    this.cleanupDragStyles();
  }

  onDragEnd(): void {
    this.cleanupDragStyles();
  }

  private cleanupDragStyles(): void {
    this.draggedFieldIndex.set(null);
    document.querySelectorAll('.draggable-field').forEach(el => {
      (el as HTMLElement).style.opacity = '1';
      el.classList.remove('drag-over');
    });
  }
}