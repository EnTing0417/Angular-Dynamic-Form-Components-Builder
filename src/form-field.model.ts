export interface FormOption {
  label: string;
  value: string;
}

export interface BaseField {
  id: string;
  name: string;
  modelProperty: string;
  required?: boolean;
  defaultValue?: any;
}

export interface TextField extends BaseField {
  component: 'text';
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  placeholder?: string;
  pattern?: string;
}

export interface TextareaField extends BaseField {
  component: 'textarea';
  label: string;
  placeholder?: string;
  rows?: number;
}

export interface CheckboxField extends BaseField {
  component: 'checkbox';
  label: string;
}

export interface RadioField extends BaseField {
  component: 'radio';
  legend: string;
  options: FormOption[];
}

export interface CheckboxGroupField extends BaseField {
    component: 'checkbox-group';
    legend: string;
    options: FormOption[];
}

export interface PhoneField extends BaseField {
  component: 'phone';
  legend: string;
  countryCodeLabel?: string;
  numberLabel?: string;
}

export interface AddressField extends BaseField {
  component: 'address';
  legend: string;
  streetLabel?: string;
  cityLabel?: string;
  stateLabel?: string;
  zipLabel?: string;
  countryLabel?: string;
}

export type FormField = TextField | TextareaField | CheckboxField | RadioField | CheckboxGroupField | PhoneField | AddressField;

export interface AvailableField {
  type: FormField['component'];
  label: string;
  icon: string; // SVG path
}

export interface FormPage {
  title: string;
  fields: FormField[];
}