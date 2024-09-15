import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../app/common.service';

@Injectable({
  providedIn: 'root'
})
export class CollectService {
  private buttonPressCount = new BehaviorSubject<number>(0);
  private newProgressCount = new BehaviorSubject<number>(0);
  private maxNewProgress = new BehaviorSubject<number>(100);
  private currentEnergy = new BehaviorSubject<number>(1000);
  private timerDuration = new BehaviorSubject<number>(this.getRandomTimerDuration());
  private timeRemaining = new BehaviorSubject<number>(0);
  private isTimerRunning = new BehaviorSubject<boolean>(false);
  private profitPerTap = new BehaviorSubject<number>(1);
  private coinsettings:any;
  private timerIntervalId: any = null; // To store the interval ID
  private energyRegenIntervalId: any = null; // To store the energy regeneration interval ID
  private progressDecreaseIntervalId: any = null; // To store the progress decrease interval ID
  private progressDecreaseTimeoutId: any = null;
  public commonService = inject(CommonService);
  private energyIncrement = 1;

  private energyRegenIntervalTime = 1500;
    getProfitPerTap() {
    return this.profitPerTap.asObservable();
  }

  setProfitPerTap(value: number) {
    this.profitPerTap.next(value);
  }
  getButtonPressCount() {
    return this.buttonPressCount.asObservable();
  }
  setButtonPressCount(value: number) {
    this.buttonPressCount.next(value);
  }
  private getRandomTimerDuration(): number {
    return Math.floor(Math.random() * (120 - 40 + 1)) + 40;
  }
  getNewProgressCount() {
    return this.newProgressCount.asObservable();
  }
  setCoinsetting(setting: any): void {
    this.coinsettings = setting;
  }
  getCoinsetting(): any {
    return this.coinsettings;
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
    const profitPerTapValue = this.profitPerTap.value; 
    const newValue = Math.min(this.newProgressCount.value  + profitPerTapValue, this.getclaimlimit());
    this.newProgressCount.next(newValue);
    this.stopEnergyRegen(); 
  }
  getclaimlimit(): number {
    const currentCoinTier = this.coinsettings.find(
      (coin: any) => this.buttonPressCount.value >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.claimlimit : 50;
  }

  decrementCurrentEnergy() {
    const newValue =Math.max( this.currentEnergy.value - this.profitPerTap.value, 0); 
    this.currentEnergy.next(newValue);
    this.startEnergyRegen(); // Start regenerating energy after a click
  }

  addButtonPressCount(count: number) {
    const userData=this.commonService.getUserInfo();
    userData.totalCoins=count;
    this.commonService.setUserInfo(userData);
    this.buttonPressCount.next(count);
    
  }

  resetNewProgressCount() {
    this.newProgressCount.next(0);
    this.stopProgressDecrease(); // Stop the progress decrease interval
  this.startProgressDecrease(); // Restart the decrease interval after reset
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
        this.currentEnergy.next(1000); 
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
  setEnergyRegenIntervalTime(time: number) {
    this.energyRegenIntervalTime = time;
  }
  resetEnergyRegenIntervalTime() {
    this.energyRegenIntervalTime = 1500;
  }
  startEnergyRegen() {
    // Ensure only one energy regeneration process runs at a time
    if (this.energyRegenIntervalId !== null) return;

    this.energyRegenIntervalId = setInterval(() => {
      const newValue = this.currentEnergy.value + this.energyIncrement;

      // If energy is already at max, stop regeneration
      if (newValue >= 1000) {
        this.currentEnergy.next(1000);
        this.stopEnergyRegen();
      } else {
        this.currentEnergy.next(newValue);
      }
    },  this.energyRegenIntervalTime); // 1500 ms = 1.5 seconds
  }
  setEnergyIncrement(value: number) {
    this.energyIncrement = value;
  }
  resetEnergyIncrement() {
    this.energyIncrement = 1;
  }



  stopEnergyRegen() {
    if (this.energyRegenIntervalId !== null) {
      clearInterval(this.energyRegenIntervalId);
      this.energyRegenIntervalId = null;
    }
  }
  startProgressDecrease() {
    if (this.progressDecreaseIntervalId !== null) {
      return; // Avoid starting multiple intervals
    }

    this.progressDecreaseIntervalId = setInterval(() => {
      if (this.newProgressCount.value > 0) {
        const newValue = Math.max(this.newProgressCount.value - 1, 0); 
        this.newProgressCount.next(newValue);
      } else {
        clearInterval(this.progressDecreaseIntervalId);
        this.progressDecreaseIntervalId = null; // Clear the interval when progress reaches 0
      }
    }, 2000); // 2000 ms = 2 seconds
  }

  stopProgressDecrease() {
    if (this.progressDecreaseIntervalId !== null) {
      clearInterval(this.progressDecreaseIntervalId);
      this.progressDecreaseIntervalId = null;
    }
  }
  resetCurrentEnergy() {
    this.currentEnergy.next(1000);
    this.stopEnergyRegen(); 
  }
  resetProgressDecreaseAfterInactivity() {
    if (this.progressDecreaseTimeoutId !== null) {
      clearTimeout(this.progressDecreaseTimeoutId); // Clear any existing timeout
    }

    this.progressDecreaseTimeoutId = setTimeout(() => {
      this.startProgressDecrease(); // Restart progress decrease after 5 seconds of inactivity
    }, 5000); // 5000 ms = 5 seconds
  }
}
