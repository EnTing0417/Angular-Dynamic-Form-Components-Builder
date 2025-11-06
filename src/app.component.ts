import { Component, ChangeDetectionStrategy, inject, signal, computed, WritableSignal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { ThemeService } from './services/theme.service';
import { ProfileDataService } from './services/profile-data.service';
import { FormSubmissionService } from './services/form-submission.service';
import { TextInputComponent } from './components/simple/text-input/text-input.component';
import { TextareaInputComponent } from './components/simple/textarea-input/textarea-input.component';
import { CheckboxInputComponent } from './components/simple/checkbox-input/checkbox-input.component';
import { RadioGroupComponent } from './components/simple/radio-group/radio-group.component';
import { CheckboxGroupComponent } from './components/simple/checkbox-group/checkbox-group.component';
import { AddressInputComponent } from './components/custom/address-input/address-input.component';
import { PhoneInputComponent } from './components/custom/phone-input/phone-input.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';
import { FormConfigurationComponent } from './components/form-configuration/form-configuration.component';
import { FormField, AvailableField, FormPage } from './form-field.model';


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
    PropertyPanelComponent,
    FormConfigurationComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  themeService = inject(ThemeService);
  private profileDataService = inject(ProfileDataService);
  private formSubmissionService = inject(FormSubmissionService);

  @ViewChild('userForm') userForm?: NgForm;

  initialFormPages = signal<FormPage[]>([]);
  initialProfileData = signal<{ [key: string]: any }>({});

  formPages: WritableSignal<FormPage[]>;
  userProfile: WritableSignal<{ [key: string]: any }>;
  
  draggedFieldPath = signal<{ pageIndex: number; fieldIndex: number } | null>(null);
  selectedFieldPath = signal<{ pageIndex: number; fieldIndex: number } | null>(null);
  submissionStatus = signal<'idle' | 'submitted' | 'submitting'>('idle');
  submissionAttempted = signal(false);
  currentPageIndex = signal<number>(0);

  selectedField = computed(() => {
    const path = this.selectedFieldPath();
    if (path === null) return null;
    return this.formPages()[path.pageIndex].fields[path.fieldIndex] ?? null;
  });

  isFormDirty = computed(() => {
    return !this.isDeepEqual(this.userProfile(), this.initialProfileData());
  });

  availableFields: AvailableField[];

  constructor() {
    // --- Select the form configuration to load ---
    this.profileDataService.setFormConfiguration('defaultUserProfile');
    
    this.formPages = signal<FormPage[]>([]);
    this.userProfile = signal<{ [key: string]: any }>({});
    
    this.availableFields = this.profileDataService.getAvailableFields();
    
    this.reloadForm();
  }
  
  reloadForm(): void {
    const initialPages = this.profileDataService.getInitialFormPages();
    const initialProfile = this.profileDataService.getInitialUserProfile();
    
    this.initialFormPages.set(initialPages);
    this.initialProfileData.set(initialProfile);

    this.formPages.set(initialPages);
    this.userProfile.set(initialProfile);

    this.currentPageIndex.set(0);
    this.selectedFieldPath.set(null);
    this.submissionAttempted.set(false);
    this.submissionStatus.set('idle');
    
    // Using setTimeout to allow signals to update the view
    // before the form is reset, which can be sensitive to timing.
    setTimeout(() => {
        this.userForm?.resetForm(initialProfile);
    });
  }

  private isDeepEqual(objA: any, objB: any): boolean {
    if (objA === objB) return true;
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) return false;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !this.isDeepEqual(objA[key], objB[key])) return false;
    }
    return true;
  }
  
  getLabel(field: FormField): string {
    if ('label' in field && field.label) return field.label.replace(' *', '');
    if ('legend' in field && field.legend) return field.legend.replace(' *', '');
    switch (field.component) {
        case 'phone': return 'Phone';
        case 'address': return 'Shipping Address';
        default: return 'This field';
    }
  }
  
  deleteField(pageIndex: number, fieldIndex: number): void {
    const currentPath = this.selectedFieldPath();
    if (currentPath?.pageIndex === pageIndex && currentPath?.fieldIndex === fieldIndex) {
      this.selectedFieldPath.set(null);
    }

    const fieldToDelete = this.formPages()[pageIndex].fields[fieldIndex];
    this.formPages.update(pages => {
      const newPages = [...pages];
      newPages[pageIndex].fields.splice(fieldIndex, 1);
      return newPages;
    });

    this.userProfile.update(profile => {
      delete profile[fieldToDelete.modelProperty];
      return {...profile};
    });
  }

  updateField(updatedField: FormField): void {
    const path = this.selectedFieldPath();
    if (path === null) return;

    const oldField = this.formPages()[path.pageIndex].fields[path.fieldIndex];

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

    this.formPages.update(pages => {
      const newPages = [...pages];
      newPages[path.pageIndex].fields[path.fieldIndex] = updatedField;
      return newPages;
    });
  }

  selectField(pageIndex: number, fieldIndex: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedFieldPath.set({ pageIndex, fieldIndex });
  }

  onModelChange(property: string, value: any): void {
    this.userProfile.update(profile => ({
      ...profile,
      [property]: value
    }));
  }
  
  async onSubmit(form: NgForm): Promise<void> {
    this.submissionAttempted.set(true);
    if (!form.valid) {
      console.log('Form is invalid. Cannot submit.');
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    this.submissionStatus.set('submitting');

    try {
      const result = await this.formSubmissionService.submitProfile(this.userProfile(), this.formPages());

      this.initialProfileData.set(result.updatedProfileData);
      this.initialFormPages.set(result.updatedFormPages);
      
      this.submissionStatus.set('submitted');
      this.submissionAttempted.set(false);
      setTimeout(() => this.submissionStatus.set('idle'), 4000);

    } catch (error) {
      console.error('Submission failed:', error);
      this.submissionStatus.set('idle');
    }
  }

  resetForm(form: NgForm): void {
    this.submissionAttempted.set(false);
    this.formPages.set(this.initialFormPages());
    this.userProfile.set(this.initialProfileData());
    this.selectedFieldPath.set(null);
    form.resetForm(this.initialProfileData());
  }

  // --- Drag and Drop Handlers ---

  onPaletteDragStart(event: DragEvent, fieldType: FormField['component']): void {
    event.dataTransfer?.setData('action', 'add-field');
    event.dataTransfer?.setData('fieldType', fieldType);
  }

  onFieldDragStart(event: DragEvent, pageIndex: number, fieldIndex: number): void {
    this.draggedFieldPath.set({ pageIndex, fieldIndex });
    const currentPath = this.selectedFieldPath();
    if (currentPath?.pageIndex === pageIndex && currentPath?.fieldIndex === fieldIndex) {
      this.selectedFieldPath.set(null);
    }
    event.dataTransfer?.setData('action', 'move-field');
    const draggableEl = (event.target as HTMLElement).closest('.draggable-field');
    if (draggableEl) {
      (draggableEl as HTMLElement).style.opacity = '0.5';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragEnter(event: DragEvent, pageIndex: number, fieldIndex: number): void {
    event.preventDefault();
    const draggedPath = this.draggedFieldPath();
    if (draggedPath && draggedPath.pageIndex === pageIndex && draggedPath.fieldIndex === fieldIndex) return;
    
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

  onDrop(event: DragEvent, dropPageIndex: number, dropFieldIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    const action = event.dataTransfer?.getData('action');

    if (action === 'move-field') {
      const draggedPath = this.draggedFieldPath();
      if (draggedPath && draggedPath.pageIndex === dropPageIndex && draggedPath.fieldIndex !== dropFieldIndex) {
        this.formPages.update(pages => {
          const newPages = [...pages];
          const pageFields = [...newPages[draggedPath.pageIndex].fields];
          const [draggedItem] = pageFields.splice(draggedPath.fieldIndex, 1);
          pageFields.splice(dropFieldIndex, 0, draggedItem);
          newPages[draggedPath.pageIndex].fields = pageFields;
          return newPages;
        });
      }
    } else if (action === 'add-field') {
      const fieldType = event.dataTransfer?.getData('fieldType') as FormField['component'];
      if (fieldType) {
        const newField = this.profileDataService.createFieldConfig(fieldType);
        this.formPages.update(pages => {
          const newPages = [...pages];
          const pageFields = [...newPages[dropPageIndex].fields];
          pageFields.splice(dropFieldIndex, 0, newField);
          newPages[dropPageIndex].fields = pageFields;
          return newPages;
        });
        this.userProfile.update(profile => {
          profile[newField.modelProperty] = this.profileDataService.getInitialValueForField(newField);
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
    this.draggedFieldPath.set(null);
    document.querySelectorAll('.draggable-field').forEach(el => {
      (el as HTMLElement).style.opacity = '1';
      el.classList.remove('drag-over');
    });
  }
}