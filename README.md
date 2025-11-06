# Angular Form Components Showcase & Builder

This project is a dynamic, interactive showcase of complex and reusable form components built with modern Angular. It demonstrates a powerful form builder where users can construct forms by dragging and dropping components, reordering them, and editing their properties in real-time. The application is styled with Tailwind CSS and leverages Angular's latest features, including standalone components and signals for state management.

## Key Features

- **Dynamic Form Building**: Drag components from a palette to add them to the form. Drag existing fields to reorder them instantly.
- **Component Palette**: A sidebar with a variety of pre-built form fields ready to be used.
- **Real-Time Property Editing**: Click on any form field to open its configuration in the property panel. All changes (labels, placeholders, options, required status, etc.) are reflected live.
- **Reusable Components**: A collection of both simple and complex form controls, all built as self-contained Angular components.
- **Complex Validation**: Custom components like `Address` and `Phone` have built-in validation logic for their sub-fields.
- **Template-Driven Forms**: Demonstrates the power and simplicity of Angular's template-driven approach for handling form state and validation.
- **Live Form Status**: A debug panel at the bottom shows the form's real-time state (`valid`, `dirty`, `touched`) and its current JSON value.
- **Dark/Light Theme**: A theme toggler to switch between light and dark modes, with the user's preference saved to local storage.
- **Modern Angular**: Built with Angular's latest features, including zoneless change detection and standalone components by default.

## Components Showcase

### Simple Components
- **Text Input**: A standard text field with support for various HTML input types (`text`, `email`, `password`) and regex pattern validation.
- **Textarea**: A multi-line text input field.
- **Checkbox**: A single checkbox for boolean values, with support for `required` validation.
- **Radio Group**: A group of radio buttons for selecting a single option.
- **Checkbox Group**: A group of checkboxes for selecting multiple options.

### Custom Components
- **Phone Input**: A composite component for entering a phone number, with separate fields for the country code and the main number.
- **Address Input**: A fieldset for entering a full shipping address, including Street, City, State, ZIP Code, and Country.

## How It Works

The application is built around a central `AppComponent` that manages the state of the form's structure and its data using **Angular Signals**.

1.  **Form Structure (`formFields` signal)**: An array of configuration objects defines which fields are in the form, their order, and their properties.
2.  **Form Data (`userProfile` signal)**: A simple object holds the actual data entered by the user.
3.  **Rendering**: The main template uses an `@for` loop to iterate over the `formFields` signal. An `@switch` statement then dynamically renders the correct component for each field type.
4.  **Property Panel**: When a field is selected, its configuration is passed to the `PropertyPanelComponent`. The panel creates a local, editable copy. As the user makes changes, it emits the updated configuration back to the `AppComponent`, which updates the main `formFields` signal, causing the form to re-render with the new properties.
5.  **Drag and Drop**: The HTML Drag and Drop API is used to handle adding new fields from the palette and reordering existing fields within the form.

## Technologies Used

- **Angular**: The core framework for building the application.
- **TypeScript**: For strong typing and modern JavaScript features.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Angular Signals**: For reactive state management within the components.
- **Angular Template-Driven Forms**: For managing form controls, validation, and data binding.

## Running Unit Tests

This project includes a suite of unit tests located in `.spec.ts` files alongside their corresponding source files. These tests are written using Angular's testing utilities (`TestBed`) and Jasmine.

To run these tests, you would typically use the Angular CLI in a standard project setup:
```bash
ng test
```
However, this project is configured for a browser-based, "buildless" development environment that does not include a test runner. Therefore, while the test files are present and valid, they cannot be executed directly within this specific environment. They are provided as a demonstration of best practices for testing Angular applications.

## How to Run Locally

This project is designed for a browser-based development environment that handles TypeScript compilation and dependency management automatically, which is why it lacks a `package.json` or `angular.json` file.

To run a similar setup on your local machine, you would need:

1.  **A Local Web Server**: You can use any simple HTTP server. If you have Node.js installed, you can use a package like `serve`:
    ```bash
    # Install the server globally
    npm install -g serve

    # Navigate to the project's root directory
    cd your-project-folder

    # Start the server
    serve
    ```

2.  **TypeScript Compilation**: The browser cannot run `.ts` files directly. The `index.tsx` file and all component `.ts` files need to be compiled into JavaScript. You would typically use a build tool like `tsc` (the TypeScript compiler), Vite, or esbuild to handle this process.

3.  **Dependency Management**: The `index.html` file uses an `<script type="importmap">` tag to load Angular and RxJS directly from a CDN. This setup works out-of-the-box in modern browsers and doesn't require `npm install`.

Because of the specialized, buildless setup, the easiest way to run and modify this project is within a compatible online IDE that supports this configuration.