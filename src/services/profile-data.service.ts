import { Injectable, signal } from '@angular/core';
import { FormField, FormPage, AvailableField } from '../form-field.model';
import { Address } from '../components/custom/address-input/address-input.component';
import { Phone } from '../components/custom/phone-input/phone-input.component';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  private formTemplates = signal<Map<string, FormPage[]>>(new Map());
  private activeFormKey = signal<string>('defaultUserProfile');

  private defaultUserProfile: FormPage[] = [
    {
      title: 'Personal Information',
      fields: [
        {
          id: 'field_1',
          component: 'text',
          name: 'fullName',
          modelProperty: 'fullName',
          label: 'Full Name *',
          type: 'text',
          placeholder: 'e.g. Jane Doe',
          required: true,
          defaultValue: 'Jane Doe'
        },
        {
          id: 'field_2',
          component: 'text',
          name: 'email',
          modelProperty: 'email',
          label: 'Email Address *',
          type: 'email',
          placeholder: 'e.g. jane.doe@example.com',
          required: true,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          defaultValue: 'jane.doe@example.com'
        },
        {
            id: 'field_phone_1',
            component: 'phone',
            name: 'primaryPhone',
            modelProperty: 'primaryPhone',
            legend: 'Primary Phone *',
            required: true,
            defaultValue: { countryCode: '+1', number: '555-123-4567' } as Phone
        }
      ]
    },
    {
      title: 'Work Information',
      fields: [
        {
          id: 'field_work_1',
          component: 'text',
          name: 'company',
          modelProperty: 'company',
          label: 'Company Name',
          type: 'text',
          placeholder: 'e.g. Acme Corp',
          defaultValue: 'Acme Corporation'
        },
        {
          id: 'field_work_2',
          component: 'text',
          name: 'jobTitle',
          modelProperty: 'jobTitle',
          label: 'Job Title',
          type: 'text',
          placeholder: 'e.g. Lead Developer',
          defaultValue: 'Solutions Architect'
        }
      ]
    },
    {
      title: 'Address & Bio',
      fields: [
         {
            id: 'field_addr_1',
            component: 'address',
            name: 'shippingAddress',
            modelProperty: 'shippingAddress',
            legend: 'Shipping Address *',
            required: true,
            defaultValue: {
                street: '123 Maple Street',
                city: 'Anytown',
                state: 'CA',
                zip: '12345',
                country: 'USA'
            } as Address
        },
        {
          id: 'field_3',
          component: 'textarea',
          name: 'bio',
          modelProperty: 'bio',
          label: 'Biography',
          placeholder: 'Tell us a bit about yourself...',
          rows: 4,
          defaultValue: 'I am a software developer with a passion for creating intuitive and dynamic user experiences.'
        },
      ]
    },
    {
      title: 'Account Settings',
      fields: [
        {
          id: 'field_4',
          component: 'radio',
          name: 'accountType',
          modelProperty: 'accountType',
          legend: 'Account Type',
          options: [
            { label: 'Personal', value: 'personal' },
            { label: 'Business', value: 'business' }
          ],
          defaultValue: 'personal'
        },
        {
            id: 'field_5',
            component: 'checkbox-group',
            name: 'interests',
            modelProperty: 'interests',
            legend: 'Interests *',
            required: true,
            options: [
              { label: 'Technology', value: 'tech' },
              { label: 'Sports', value: 'sports' },
              { label: 'Music', value: 'music' },
              { label: 'Art', value: 'art' }
            ],
            defaultValue: { tech: true, music: true, sports: false, art: false }
        },
        {
          id: 'field_6',
          component: 'checkbox',
          name: 'newsletter',
          modelProperty: 'newsletter',
          label: 'Subscribe to newsletter',
          required: false,
          defaultValue: true
        },
        {
            id: 'field_7',
            component: 'checkbox',
            name: 'terms',
            modelProperty: 'terms',
            label: 'I agree to the terms and conditions *',
            required: true,
            defaultValue: false
        }
      ]
    }
  ];
  
  private customRegistration: FormPage[] = [
    {
      title: 'Custom Registration',
      fields: [
        {
          id: 'custom_username',
          component: 'text',
          name: 'username',
          modelProperty: 'username',
          label: 'Create a Username *',
          type: 'text',
          placeholder: 'e.g. user123',
          required: true,
          defaultValue: ''
        },
        {
          id: 'custom_password',
          component: 'text',
          name: 'password',
          modelProperty: 'password',
          label: 'Choose a Password *',
          type: 'password',
          placeholder: '••••••••',
          required: true,
          defaultValue: ''
        },
        {
          id: 'custom_accept_policy',
          component: 'checkbox',
          name: 'policy',
          modelProperty: 'policy',
          label: 'I accept the Privacy Policy *',
          required: true,
          defaultValue: false
        }
      ]
    }
  ];

  private availableFields: AvailableField[] = [
    { type: 'text', label: 'Text Input', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' },
    { type: 'textarea', label: 'Textarea', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12' },
    { type: 'checkbox', label: 'Checkbox', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'radio', label: 'Radio Group', icon: 'M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9' },
    { type: 'checkbox-group', label: 'Checkbox Group', icon: 'M4.5 12.75l6 6 9-13.5' },
    { type: 'phone', label: 'Phone Input', icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z' },
    { type: 'address', label: 'Address Input', icon: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3.75h.75A2.25 2.25 0 0121.75 6v12' }
  ];

  constructor() {
    const initialTemplates = new Map<string, FormPage[]>();
    initialTemplates.set('defaultUserProfile', this.defaultUserProfile);
    initialTemplates.set('customRegistration', this.customRegistration);
    this.formTemplates.set(initialTemplates);
  }

  /**
   * Returns the key of the currently active form configuration.
   */
  public getActiveFormKey(): string {
    return this.activeFormKey();
  }

  /**
   * Returns an array of keys for all registered form templates.
   */
  public getFormTemplateKeys(): string[] {
    return Array.from(this.formTemplates().keys());
  }

  /**
   * Returns a JSON string representation of a form template.
   * @param key The key of the form template to retrieve.
   */
  public getFormTemplateAsJson(key: string): string {
    if (this.formTemplates().has(key)) {
      return JSON.stringify(this.formTemplates().get(key), null, 2);
    }
    return '';
  }

  /**
   * Sets the active form configuration that the application will load.
   * @param key The key of the form template to activate (e.g., 'defaultUserProfile', 'customRegistration').
   */
  public setFormConfiguration(key: string): void {
    if (this.formTemplates().has(key)) {
      this.activeFormKey.set(key);
    } else {
      console.error(`Form configuration with key "${key}" not found. Using default.`);
      this.activeFormKey.set('defaultUserProfile');
    }
  }

  /**
   * Allows dynamically adding or overwriting a form configuration.
   * This method replaces the previous `customizeInitialForm`.
   * @param key A unique key for the new form configuration.
   * @param pages An array of FormPage objects defining the form structure.
   */
  public registerFormConfiguration(key: string, pages: FormPage[]): void {
    if (!pages || !Array.isArray(pages)) {
      console.error('Invalid configuration for registering form. An array of FormPage objects is expected.');
      return;
    }
    this.formTemplates.update(currentTemplates => {
        const newTemplates = new Map(currentTemplates);
        if (newTemplates.has(key)) {
            console.warn(`Overwriting existing form configuration with key "${key}".`);
        }
        newTemplates.set(key, JSON.parse(JSON.stringify(pages)));
        return newTemplates;
    });
  }

  getInitialFormPages(): FormPage[] {
    const pages = this.formTemplates().get(this.activeFormKey());
    if (!pages) {
      console.error(`Could not find active form configuration: ${this.activeFormKey()}. Falling back to default.`);
      return JSON.parse(JSON.stringify(this.formTemplates().get('defaultUserProfile')!));
    }
    return JSON.parse(JSON.stringify(pages));
  }

  getInitialUserProfile(): { [key: string]: any } {
    const pages = this.formTemplates().get(this.activeFormKey());
    const activePages = pages ?? this.formTemplates().get('defaultUserProfile')!;
    
    return activePages
      .flatMap(page => page.fields)
      .reduce((profile, field) => {
        if (Object.prototype.hasOwnProperty.call(field, 'defaultValue')) {
          // Deep copy to prevent shared object references
          profile[field.modelProperty] = JSON.parse(JSON.stringify(field.defaultValue));
        } else {
          // Fallback for fields without a default
          profile[field.modelProperty] = this.getInitialValueForField(field);
        }
        return profile;
      }, {} as { [key: string]: any });
  }
  
  getAvailableFields(): AvailableField[] {
    return this.availableFields;
  }

  createFieldConfig(type: FormField['component']): FormField {
    const newId = `field_${Date.now()}`;
    const newName = `${type}_${Math.random().toString(36).substring(2, 7)}`;
    const baseConfig = { id: newId, name: newName, modelProperty: newName, required: false };

    switch(type) {
      case 'text':
        return { ...baseConfig, component: 'text', label: 'New Text Input', type: 'text' };
      case 'textarea':
        return { ...baseConfig, component: 'textarea', label: 'New Textarea', rows: 3 };
      case 'checkbox':
        return { ...baseConfig, component: 'checkbox', label: 'New Checkbox' };
      case 'radio':
        return { ...baseConfig, component: 'radio', legend: 'New Radio Group', options: [{ label: 'Option 1', value: 'opt1' }] };
      case 'checkbox-group':
        return { ...baseConfig, component: 'checkbox-group', legend: 'New Checkbox Group', options: [{ label: 'Option 1', value: 'opt1' }] };
      case 'phone':
        return { ...baseConfig, component: 'phone', legend: 'New Phone Input' };
      case 'address':
        return { ...baseConfig, component: 'address', legend: 'New Address Input' };
    }
  }
  
  getInitialValueForField(field: FormField): any {
    switch (field.component) {
      case 'text':
      case 'textarea':
        return '';
      case 'checkbox':
        return false;
      case 'radio':
        return field.options.length > 0 ? field.options[0].value : null;
      case 'checkbox-group':
        return {};
      case 'phone':
        return { countryCode: '+1', number: '' };
      case 'address':
        return { street: '', city: '', state: '', zip: '', country: '' };
      default:
        return null;
    }
  }
}