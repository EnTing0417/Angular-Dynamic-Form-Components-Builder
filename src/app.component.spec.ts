import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgForm, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { FormField, TextField } from './form-field.model';

// Fix: Add declarations for jasmine globals to resolve TS errors
declare var describe: any;
declare var it: any;
declare var expect: any;
declare var beforeEach: any;
declare var spyOn: any;
declare var jasmine: any;

class MockThemeService {
  theme = signal('light');
  toggleTheme = jasmine.createSpy('toggleTheme');
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: ThemeService, useClass: MockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should select a field when selectField is called', () => {
    // FIX: Use selectedFieldPath instead of selectedFieldIndex
    expect(component.selectedFieldPath()).toBeNull();
    // FIX: provide pageIndex, fieldIndex, and event to selectField
    component.selectField(0, 0, new MouseEvent('click'));
    // FIX: Use selectedFieldPath and check for the path object
    expect(component.selectedFieldPath()).toEqual({ pageIndex: 0, fieldIndex: 0 });
    // FIX: Access fields from formPages array
    expect(component.selectedField()).toEqual(component.formPages()[0].fields[0]);
  });

  it('should delete a field when deleteField is called', () => {
    // FIX: Access fields from formPages array
    const initialLength = component.formPages().flatMap(p => p.fields).length;
    // FIX: Access fields from formPages array
    const fieldToDelete = component.formPages()[0].fields[1];

    // FIX: Provide pageIndex and fieldIndex to deleteField
    component.deleteField(0, 1);
    fixture.detectChanges();

    // FIX: Access fields from formPages array
    expect(component.formPages().flatMap(p => p.fields).length).toBe(initialLength - 1);
    // FIX: Access fields from formPages array
    expect(component.formPages().flatMap(p => p.fields).find(f => f.id === fieldToDelete.id)).toBeUndefined();
    expect(component.userProfile()[fieldToDelete.modelProperty]).toBeUndefined();
  });

  it('should update a field when updateField is called', () => {
    // FIX: provide pageIndex, fieldIndex, and event to selectField
    component.selectField(0, 0, new MouseEvent('click'));
    const originalField = { ...(component.selectedField()! as TextField) };
    const updatedField: FormField = { ...originalField, label: 'Updated Full Name *' };

    component.updateField(updatedField);
    fixture.detectChanges();

    // FIX: Access fields from formPages array
    expect((component.formPages()[0].fields[0] as TextField).label).toBe('Updated Full Name *');
  });

  it('should reset the form to its initial state', () => {
    // Dirty the form
    component.onModelChange('fullName', 'New Name');
    fixture.detectChanges();
    expect(component.userProfile()['fullName']).toBe('New Name');
    
    const mockForm = { resetForm: (data: any) => {} } as NgForm;
    spyOn(mockForm, 'resetForm');

    component.resetForm(mockForm);
    fixture.detectChanges();

    expect(component.userProfile()['fullName']).toBe('Jane Doe');
    expect(mockForm.resetForm).toHaveBeenCalled();
  });

  describe('onSubmit', () => {
    let mockForm: {
      valid: boolean;
      value: any;
      controls: { [key: string]: any; };
      // Fix: Changed from jasmine.Spy to any to match declared jasmine global
      resetForm: any;
    };

    beforeEach(() => {
        // Create a mock NgForm with mutable properties for testing
        mockForm = {
            valid: true,
            value: { ...component.userProfile() },
            controls: {},
            resetForm: jasmine.createSpy('resetForm')
        };
    });

    it('should not submit if form is invalid', () => {
        mockForm.valid = false;
        const markAsTouchedSpy = jasmine.createSpy('markAsTouched');
        mockForm.controls = { fullName: { markAsTouched: markAsTouchedSpy } as any };
        spyOn(console, 'log');

        component.onSubmit(mockForm as unknown as NgForm);

        expect(console.log).toHaveBeenCalledWith('Form is invalid. Cannot submit.');
        expect(markAsTouchedSpy).toHaveBeenCalled();
        expect(component.submissionStatus()).toBe('idle');
    });

    it('should submit if form is valid', fakeAsync(() => {
        const newName = 'John Smith';
        component.onModelChange('fullName', newName);
        fixture.detectChanges();
        mockForm.value = { ...component.userProfile() };

        component.onSubmit(mockForm as unknown as NgForm);

        expect(component.submissionStatus()).toBe('submitted');
        
        // The form should now be pristine because the initial data was updated
        expect(component.isFormDirty()).toBe(false);
        
        // The 'initial' data should now reflect the submitted name
        component.resetForm(mockForm as unknown as NgForm);
        expect(component.userProfile()['fullName']).toBe(newName);
        
        // Test that the success message disappears
        tick(4000);
        expect(component.submissionStatus()).toBe('idle');
    }));
  });
  
  describe('Drag and Drop', () => {
    it('should add a new field on drop from palette', () => {
        // FIX: Access fields from formPages array
        const initialLength = component.formPages().flatMap(p => p.fields).length;
        const mockDragEvent = new DragEvent('drop', {
            dataTransfer: new DataTransfer()
        });
        mockDragEvent.dataTransfer?.setData('action', 'add-field');
        mockDragEvent.dataTransfer?.setData('fieldType', 'text');

        // FIX: provide pageIndex and fieldIndex to onDrop
        component.onDrop(mockDragEvent, 0, 1);
        fixture.detectChanges();

        // FIX: Access fields from formPages array
        expect(component.formPages().flatMap(p => p.fields).length).toBe(initialLength + 1);
        // FIX: Access fields from formPages array and check the correct index
        expect(component.formPages()[0].fields[1].component).toBe('text');
        // FIX: Access fields from formPages array and check the correct index
        expect(component.userProfile()[component.formPages()[0].fields[1].modelProperty]).toBe('');
    });

    it('should move an existing field on drop', () => {
        // FIX: Access fields from formPages array
        const fieldToMove = component.formPages()[0].fields[0];
        // FIX: Use draggedFieldPath and set the path object
        component.draggedFieldPath.set({ pageIndex: 0, fieldIndex: 0 }); // Start dragging the first field

        const mockDragEvent = new DragEvent('drop', {
            dataTransfer: new DataTransfer()
        });
        mockDragEvent.dataTransfer?.setData('action', 'move-field');

        // Drop it at index 2 of page 0
        // FIX: provide pageIndex and fieldIndex to onDrop
        component.onDrop(mockDragEvent, 0, 2);
        fixture.detectChanges();

        // FIX: Access fields from formPages array and check the correct index
        expect(component.formPages()[0].fields[2].id).toBe(fieldToMove.id);
    });
  });

});
