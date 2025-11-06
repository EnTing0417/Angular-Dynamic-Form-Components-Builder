import { Component, signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TextInputComponent } from './text-input.component';

// Fix: Add declarations for jasmine globals to resolve TS errors
declare var describe: any;
declare var it: any;
declare var expect: any;
declare var beforeEach: any;

@Component({
  template: `
    <app-text-input
      label="Test Label"
      id="test-input"
      [formControl]="formControl"
      [required]="required()"
    ></app-text-input>
  `,
})
class TestHostComponent {
  formControl = new FormControl('initial value');
  required = signal(false);
}

describe('TextInputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let textInputComponent: TextInputComponent;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TextInputComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const textInputDebugEl = fixture.debugElement.query(By.directive(TextInputComponent));
    textInputComponent = textInputDebugEl.componentInstance;
    inputElement = textInputDebugEl.query(By.css('input')).nativeElement;
  });

  it('should create', () => {
    expect(textInputComponent).toBeTruthy();
  });

  it('should display the initial value from the form control', () => {
    expect(inputElement.value).toBe('initial value');
  });

  it('should update the form control when the input value changes', () => {
    inputElement.value = 'new value';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.formControl.value).toBe('new value');
  });

  it('should be disabled when the form control is disabled', () => {
    component.formControl.disable();
    fixture.detectChanges();
    expect(inputElement.disabled).toBe(true);
  });

  it('should mark the control as touched on blur', () => {
    expect(component.formControl.touched).toBe(false);
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(component.formControl.touched).toBe(true);
  });

  it('should show invalid styles when control is invalid and touched', () => {
    component.required.set(true);
    fixture.detectChanges();

    component.formControl.setValue('');
    component.formControl.markAsTouched();
    fixture.detectChanges();
    
    expect(component.formControl.invalid).toBe(true);
    expect(inputElement.classList.contains('border-red-500')).toBe(true);
  });

  it('should not show invalid styles when control is invalid but pristine', () => {
    component.required.set(true);
    fixture.detectChanges();
    
    component.formControl.setValue('');
    fixture.detectChanges();
    
    expect(component.formControl.invalid).toBe(true);
    expect(inputElement.classList.contains('border-red-500')).toBe(false);
  });
});
