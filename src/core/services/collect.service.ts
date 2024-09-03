import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectService {
  private buttonPressCount = new BehaviorSubject<number>(0);
  private newProgressCount = new BehaviorSubject<number>(0);
  private maxNewProgress = new BehaviorSubject<number>(100);
  private currentEnergy = new BehaviorSubject<number>(10);
  private timerDuration = new BehaviorSubject<number>(60);
  private timeRemaining = new BehaviorSubject<number>(0);
  private isTimerRunning = new BehaviorSubject<boolean>(false);

  private timerIntervalId: any = null; // To store the interval ID
  private energyRegenIntervalId: any = null; // To store the energy regeneration interval ID

  getButtonPressCount() {
    return this.buttonPressCount.asObservable();
  }

  getNewProgressCount() {
    return this.newProgressCount.asObservable();
  }

  getMaxNewProgress() {
    return this.maxNewProgress.asObservable();
  }

  getCurrentEnergy() {
    return this.currentEnergy.asObservable();
  }

  getTimeRemaining() {
    return this.timeRemaining.asObservable();
  }

  isTimerCurrentlyRunning() {
    return this.isTimerRunning.asObservable();
  }

  incrementNewProgressCount() {
    const newValue = this.newProgressCount.value + 1;
    this.newProgressCount.next(newValue);
    this.stopEnergyRegen(); // Stop regenerating energy when the button is clicked
  }

  decrementCurrentEnergy() {
    const newValue = this.currentEnergy.value - 1;
    this.currentEnergy.next(newValue);
    this.startEnergyRegen(); // Start regenerating energy after a click
  }

  addButtonPressCount(count: number) {
    const newValue = this.buttonPressCount.value + count;
    this.buttonPressCount.next(newValue);
  }

  resetNewProgressCount() {
    this.newProgressCount.next(0);
  }

  startTimer(telegramServices: any) {
    // Avoid starting the timer if it is already running
    if (this.isTimerRunning.value) {
      return;
    }

    this.isTimerRunning.next(true);
    this.timeRemaining.next(this.timerDuration.value);

    // Clear any existing timer to avoid multiple timers running
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
    }
    this.stopEnergyRegen();

    this.timerIntervalId = setInterval(() => {
      const newTimeRemaining = this.timeRemaining.value - 1;
      this.timeRemaining.next(newTimeRemaining);

      if (newTimeRemaining <= 0) {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
        this.currentEnergy.next(1000); // Reset energy to 1000
        this.isTimerRunning.next(false);
        telegramServices.hapticFeedback.impactOccurred('medium');
        this.startEnergyRegen(); // Start energy regeneration after the timer completes
      }
    }, 1000); // 1000 ms = 1 second
  }

  clearTimer() {
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  startEnergyRegen() {
    // Ensure only one energy regeneration process runs at a time
    if (this.energyRegenIntervalId !== null) return;

    this.energyRegenIntervalId = setInterval(() => {
      const newValue = this.currentEnergy.value + 1;

      // If energy is already at max, stop regeneration
      if (newValue >= 1000) {
        this.currentEnergy.next(1000);
        this.stopEnergyRegen();
      } else {
        this.currentEnergy.next(newValue);
      }
    }, 1500); // 1500 ms = 1.5 seconds
  }

  stopEnergyRegen() {
    if (this.energyRegenIntervalId !== null) {
      clearInterval(this.energyRegenIntervalId);
      this.energyRegenIntervalId = null;
    }
  }
}
