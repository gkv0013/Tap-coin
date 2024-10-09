import { Injectable } from '@angular/core';
import * as hopscotch from 'hopscotch';
@Injectable({
  providedIn: 'root'
})
export class HopscotchService {

  constructor() { }
  startTour(tour: any): void {
    hopscotch.startTour(tour);
  }

  // Method to end the tour
  endTour(): void {
    hopscotch.endTour(true);
  }

  // Method to define a tour
  defineTour(steps: any[]): any {
    return {
      id: 'my-app-tour',
      steps: steps,
      showPrevButton: true,
      scrollTopMargin: 100
    };
  }
}
