import { Injectable } from '@angular/core';
import { FormPage } from '../form-field.model';

export interface SubmissionResult {
  updatedProfileData: { [key: string]: any };
  updatedFormPages: FormPage[];
}

@Injectable({
  providedIn: 'root'
})
export class FormSubmissionService {

  // Simulate an async API call
  submitProfile(profileData: { [key: string]: any }, formPages: FormPage[]): Promise<SubmissionResult> {
    console.log('Submitting profile data via service...', profileData);
    
    return new Promise(resolve => {
      setTimeout(() => {
        // In a real app, you'd get the response from the server.
        // Here, we mimic the previous logic of updating the "initial" state.
        const result: SubmissionResult = {
          updatedProfileData: JSON.parse(JSON.stringify(profileData)),
          updatedFormPages: JSON.parse(JSON.stringify(formPages))
        };
        console.log('Submission successful.');
        resolve(result);
      }, 1500); // Simulate network latency
    });
  }
}
