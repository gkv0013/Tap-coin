import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectService {
  private buttonPressCount = new BehaviorSubject<number>(this.getFromLocalStorage('buttonPressCount', 0));
  private newProgressCount = new BehaviorSubject<number>(this.getFromLocalStorage('newProgressCount', 0));
  private maxNewProgress = new BehaviorSubject<number>(this.getFromLocalStorage('maxNewProgress', 100));
  private currentEnergy = new BehaviorSubject<number>(this.getFromLocalStorage('currentEnergy', 100));
  private timerDuration = new BehaviorSubject<number>(this.getFromLocalStorage('timerDuration', 60));
  private timeRemaining = new BehaviorSubject<number>(this.getFromLocalStorage('timeRemaining', 0));
  private isTimerRunning = new BehaviorSubject<boolean>(this.getFromLocalStorage('isTimerRunning', false));
  
  private timerIntervalId: any = null; // To store the interval ID

  private saveToLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private getFromLocalStorage<T>(key: string, defaultValue: T): T {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  }

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
    this.saveToLocalStorage('newProgressCount', newValue);
  }

  decrementCurrentEnergy() {
    const newValue = this.currentEnergy.value - 1;
    this.currentEnergy.next(newValue);
    this.saveToLocalStorage('currentEnergy', newValue);
  }

  addButtonPressCount(count: number) {
    const newValue = this.buttonPressCount.value + count;
    this.buttonPressCount.next(newValue);
    this.saveToLocalStorage('buttonPressCount', newValue);
  }

  resetNewProgressCount() {
    this.newProgressCount.next(0);
    this.saveToLocalStorage('newProgressCount', 0);
  }

  startTimer(telegramServices: any) {
    if (!this.isTimerRunning.value) {
      this.timeRemaining.next(this.timerDuration.value);
    }
    this.isTimerRunning.next(true);
    this.saveToLocalStorage('isTimerRunning', true);

    // Clear any existing timer to avoid multiple timers running
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
    }

    this.timerIntervalId = setInterval(() => {
      const newTimeRemaining = this.timeRemaining.value - 1;
      this.timeRemaining.next(newTimeRemaining);
      this.saveToLocalStorage('timeRemaining', newTimeRemaining);

      if (newTimeRemaining <= 0) {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
        this.currentEnergy.next(100); // Reset energy to 100
        this.isTimerRunning.next(false);
        this.saveToLocalStorage('currentEnergy', 100);
        this.saveToLocalStorage('isTimerRunning', false);
        telegramServices.hapticFeedback.impactOccurred('medium');
      }
    }, 1000); // 1000 ms = 1 second
  }

  clearTimer() {
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }
}
