import { Component, ChangeDetectionStrategy, inject, signal, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileDataService } from '../../services/profile-data.service';
import { FormPage } from '../../form-field.model';

@Component({
  selector: 'app-form-configuration',
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6">Form Templates</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <!-- Left column -->
        <div class="space-y-4">
          <div>
            <label for="config-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Load Existing Template</label>
            <select
              id="config-select"
              [ngModel]="activeConfigKey()"
              (ngModelChange)="loadConfiguration($event)"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            >
              @for(key of availableConfigs(); track key) {
                <option [value]="key">{{ key }}</option>
              }
            </select>
          </div>

          <div>
            <label for="config-key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New or Existing Template Key</label>
            <input
              id="config-key"
              type="text"
              [(ngModel)]="configKey"
              placeholder="e.g., myNewForm"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <!-- Right column -->
        <div>
          <label for="config-json" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Form JSON Configuration</label>
          <textarea
            id="config-json"
            [(ngModel)]="configJson"
            rows="8"
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs"
            [class.border-red-500]="parseError()"
            [class.dark:border-red-400]="parseError()"
            placeholder="Paste FormPage[] JSON here..."
          ></textarea>
          @if(parseError(); as error) {
            <p class="text-red-500 text-sm mt-1">{{ error }}</p>
          }
        </div>
      </div>

      <div class="mt-6">
        <button
          (click)="registerAndLoad()"
          class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
        >
          Register & Load Template
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormConfigurationComponent {
  private profileDataService = inject(ProfileDataService);
  formReload = output<void>();

  configKey = signal<string>('myCustomForm');
  configJson = signal<string>('');
  parseError = signal<string | null>(null);
  
  availableConfigs = computed(() => this.profileDataService.getFormTemplateKeys());
  activeConfigKey = signal(this.profileDataService.getActiveFormKey());

  constructor() {
    this.loadConfiguration(this.activeConfigKey());
  }

  loadConfiguration(key: string): void {
    this.activeConfigKey.set(key);
    this.configKey.set(key);
    this.configJson.set(this.profileDataService.getFormTemplateAsJson(key));
    this.parseError.set(null);
  }

  registerAndLoad(): void {
    this.parseError.set(null);
    const key = this.configKey();
    if (!key) {
      this.parseError.set('Template Key cannot be empty.');
      return;
    }

    try {
      const parsedConfig: FormPage[] = JSON.parse(this.configJson());
      if (!Array.isArray(parsedConfig) || !parsedConfig.every(p => p.title && Array.isArray(p.fields))) {
          throw new Error('Invalid FormPage[] structure. Expects an array of objects with "title" and "fields" properties.');
      }

      this.profileDataService.registerFormConfiguration(key, parsedConfig);
      this.profileDataService.setFormConfiguration(key);
      this.activeConfigKey.set(key);
      this.formReload.emit();
    } catch (e) {
      this.parseError.set(`JSON Parse Error: ${(e as Error).message}`);
    }
  }
}