// --- Type Definitions for Dynamic Form Fields ---

export interface FormOption {
  value: string;
  label: string;
}

interface FormFieldBase {
  id: string;
  name: string;
  component: 'text' | 'textarea' | 'phone' | 'address' | 'radio' | 'checkbox' | 'checkbox-group';
  modelProperty: string;
  required?: boolean;
}

export interface TextField extends FormFieldBase {
  component: 'text';
  label: string;
  type?: string;
  placeholder?: string;
  pattern?: string;
}

export interface TextareaField extends FormFieldBase {
  component: 'textarea';
  label:string;
  placeholder?: string;
}

export interface PhoneField extends FormFieldBase {
  component: 'phone';
  legend: string;
  countryCodeLabel: string;
  numberLabel: string;
}

export interface AddressField extends FormFieldBase {
  component: 'address';
  legend: string;
  streetLabel: string;
  cityLabel: string;
  stateLabel: string;
  zipLabel: string;
  countryLabel: string;
}

export interface RadioField extends FormFieldBase {
  component: 'radio';
  legend: string;
  options: FormOption[];
}

export interface CheckboxField extends FormFieldBase {
  component: 'checkbox';
  label: string;
}

export interface CheckboxGroupField extends FormFieldBase {
  component: 'checkbox-group';
  legend: string;
  options: FormOption[];
}

export type FormField = TextField | TextareaField | PhoneField | AddressField | RadioField | CheckboxField | CheckboxGroupField;

export interface AvailableField {
  type: FormField['component'];
  label: string;
  icon: string; // SVG path data
}