import { inject, Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { CommonService } from '../../app/common.service';

@Injectable({
  providedIn: 'root' // This makes the service available app-wide
})
export class DayCheckerService {
   lastCheckedDate: DateTime;
   public commonService = inject(CommonService);
  constructor() {
    // Initialize with the current date using Luxon
    this.lastCheckedDate = DateTime.now();
    this.scheduleNextCheck();
  }

  // Function to calculate the time until the next midnight
  private getTimeUntilNextMidnight(): number {
    const currentDate = DateTime.now();
    const tomorrowMidnight = currentDate.plus({ days: 1 }).startOf('day');
    return tomorrowMidnight.diff(currentDate).as('milliseconds');
  }

  // Function to check if a new day has occurred and schedule the next check
  private scheduleNextCheck() {
    const timeUntilMidnight = this.getTimeUntilNextMidnight();

    // Set a timeout to trigger exactly at the next midnight
    setTimeout(() => {
      this.checkForNewDay();
    }, timeUntilMidnight);
  }

  // Function to check and log if a new day has occurred
  private checkForNewDay() {
    const currentDate = DateTime.now();

    // Compare the current date with the last checked date
    if (this.isNewDay(currentDate)) {
      const userData = this.commonService.getUserInfo();
      userData.fillenergy = 0;
      userData.ismultitap =0;
      userData.isenergyboost=0;
      this.commonService.setUserInfo(userData);
      console.log(`New day occurred: ${currentDate.toFormat('yyyy-MM-dd')}`);
      this.lastCheckedDate = currentDate; // Update the last checked date
    }

    // Schedule the next check for the next midnight
    this.scheduleNextCheck();
  }

  // Helper function to check if the day has changed
  private isNewDay(currentDate: DateTime): boolean {
    return !this.lastCheckedDate.hasSame(currentDate, 'day');
  }
}
