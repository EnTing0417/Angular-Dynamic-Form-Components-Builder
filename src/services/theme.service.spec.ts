import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { ThemeService, Theme } from './theme.service';

// Fix: Add declarations for jasmine globals to resolve TS errors
declare var describe: any;
declare var it: any;
declare var expect: any;
declare var spyOn: any;
declare var beforeEach: any;

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageMock: { [key: string]: string };

  const setup = (platform: 'browser' | 'server' = 'browser', storedTheme?: Theme, systemPrefersDark = false) => {
    localStorageMock = {};
    if (storedTheme) {
      localStorageMock['app-theme'] = storedTheme;
    }

    spyOn(localStorage, 'getItem').and.callFake((key: string) => localStorageMock[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => (localStorageMock[key] = value));

    spyOn(window, 'matchMedia').and.returnValue({
      matches: systemPrefersDark,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
    
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: platform === 'browser' ? 'browser' : 'server' },
      ],
    });

    // Manually add and remove the dark class to reset the state for each test
    document.documentElement.classList.remove('dark');
    service = TestBed.inject(ThemeService);
    // Allow the effect to run
    tick();
  };

  it('should be created', fakeAsync(() => {
    setup();
    expect(service).toBeTruthy();
  }));

  it('should initialize theme from localStorage if available', fakeAsync(() => {
    setup('browser', 'dark');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  }));

  it('should initialize theme based on system preference if localStorage is empty', fakeAsync(() => {
    setup('browser', undefined, true); // System prefers dark
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  }));

  it('should default to light theme if no preference is stored or set by system', fakeAsync(() => {
    setup('browser', undefined, false);
    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  }));

  it('should toggle theme from light to dark', fakeAsync(() => {
    setup('browser', 'light');
    expect(service.theme()).toBe('light');

    service.toggleTheme();
    tick();

    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  }));

  it('should toggle theme from dark to light', fakeAsync(() => {
    setup('browser', 'dark');
    expect(service.theme()).toBe('dark');
    
    service.toggleTheme();
    tick();
    
    expect(service.theme()).toBe('light');
    expect(localStorage.getItem('app-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  }));

  it('should not run in a non-browser environment', fakeAsync(() => {
    // We expect no errors and no localStorage/DOM manipulation
    setup('server');
    expect(service.theme()).toBe('light'); // Initial signal value
    service.toggleTheme();
    tick();
    expect(service.theme()).toBe('dark');
    // Ensure mocks were not called
    expect(localStorage.getItem).not.toHaveBeenCalled();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  }));
});
