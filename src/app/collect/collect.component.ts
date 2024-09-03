import { CommonModule } from '@angular/common';
import { Component, ElementRef, AfterViewInit, Renderer2, ViewChild, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { CommonService } from '../common.service';
import { CollectService } from '../../core/services/collect.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.css']
})
export class CollectComponent implements AfterViewInit,OnDestroy,OnInit {
  nextLevel = 5000;
  profitPerTap = 1;
  profitPerHour = 0;
  buttonPressCount = 0;
  newProgressCount = 0; // New variable for tracking progress
  maxNewProgress = 100;
  currentEnergy = 1000; // Current energy value
  maxEnergy = 110; // Maximum energy value
  shouldShakeBoostIcons = false;
  timerDuration = 60; // Timer duration in seconds (1 minute)
  timeRemaining = 0; // Time remaining for the timer
  isTimerRunning = false;
  @ViewChild('roundButton') roundButton!: ElementRef;
  @ViewChild('coinContainer') coinContainer!: ElementRef;
  @ViewChild('canvasBg') canvasBgRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasFg') canvasFgRef!: ElementRef<HTMLCanvasElement>;
  public router = inject(Router);
  private readonly telegramServices = inject(TelegramWebappService);
  private readonly renderer = inject(Renderer2);
  public commonService = inject(CommonService);
  private readonly collectService = inject(CollectService);
  private subscriptions: Subscription[] = [];

  ngAfterViewInit(): void {
    this.initBackgroundAnimation();
    this.initForegroundAnimation();
  }
  ngOnInit() {
    this.subscriptions.push(
      this.collectService.getButtonPressCount().subscribe(count => this.buttonPressCount = count),
      this.collectService.getNewProgressCount().subscribe(count => this.newProgressCount = count),
      this.collectService.getMaxNewProgress().subscribe(max => this.maxNewProgress = max),
      this.collectService.getCurrentEnergy().subscribe(energy => this.currentEnergy = energy),
      this.collectService.getTimeRemaining().subscribe(time => this.timeRemaining = time),
      this.collectService.isTimerCurrentlyRunning().subscribe(running => {
        this.isTimerRunning = running;
        if (running) {
         // this.collectService.startTimer(this.telegramServices);
        }
      })
    );
  }
  ngOnDestroy() {
    // Save the current state to the service
    this.subscriptions.forEach(sub => sub.unsubscribe());
   // this.collectService.clearTimer();
  }

  onButtonClick(event: MouseEvent) {
    if (this.newProgressCount < this.maxNewProgress && this.currentEnergy >= 1) {
      this.newProgressCount++;
      this.currentEnergy--; // Decrease energy on button click
      this.telegramServices.hapticFeedback.impactOccurred('medium');
      const button = this.roundButton.nativeElement;
      button.classList.add('pulse');
      this.collectService.incrementNewProgressCount();
      this.collectService.decrementCurrentEnergy();
      this.createFallingCoin();
      if (this.currentEnergy === 0 && !this.isTimerRunning) {
        this.collectService.startTimer(this.telegramServices);
      }
      setTimeout(() => {
        button.classList.remove('pulse');
      }, 1000);
    } else if (this.currentEnergy === 0 && !this.isTimerRunning) {
      this.collectService.startTimer(this.telegramServices);
    } else {
      this.shouldShakeBoostIcons = true;
      setTimeout(() => {
        this.shouldShakeBoostIcons = false;
      }, 500);
    }
  }
  
  routeToBoost(){
    if (this.currentEnergy == 0) {
      this.commonService.setActiveTab('pumps');
      this.router.navigate(['/pumps']);
    }
  }
  get progressPercentage() {
    return (this.buttonPressCount / this.nextLevel) * 100;
  }

  createFallingCoin() {
    const coin = this.renderer.createElement('div');
    this.renderer.addClass(coin, 'coin');
    this.renderer.addClass(coin, 'fall');

    const buttonRect = this.roundButton.nativeElement.getBoundingClientRect();
    const containerRect = this.coinContainer.nativeElement.getBoundingClientRect();
    const top = buttonRect.top - containerRect.top;
    const left = buttonRect.left - containerRect.left + buttonRect.width / 2 - 10;

    this.renderer.setStyle(coin, 'top', `${top}px`);
    this.renderer.setStyle(coin, 'left', `${left}px`);

    const container = this.coinContainer.nativeElement;
    this.renderer.appendChild(container, coin);

    setTimeout(() => {
      this.renderer.removeChild(container, coin);
    }, 1000);
  }

  initBackgroundAnimation() {
    const canvasBg = this.canvasBgRef.nativeElement;
    const ctxBg = canvasBg.getContext('2d');
    if (!ctxBg) return;

    const wBg = canvasBg.width = window.innerWidth;
    const hBg = canvasBg.height = window.innerHeight-90;
    const hueBg = 235;
    const starsBg: StarBg[] = [];
    let countBg = 0;
    const maxStarsBg = 1400;

    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d');
    if (!ctx2) return;

    canvas2.width = 100;
    canvas2.height = 100;
    const half = canvas2.width / 2;
    const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#fff');
    gradient2.addColorStop(0.1, `hsl(${hueBg}, 61%, 53%)`);
    gradient2.addColorStop(0.25, `hsl(${hueBg}, 64%, 6%)`);
    gradient2.addColorStop(1, 'transparent');
    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    function randomBg(min: number, max?: number) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      if (min > max) {
        const hold = max;
        max = min;
        min = hold;
      }
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function maxOrbitBg(x: number, y: number) {
      const max = Math.max(x, y);
      const diameter = Math.round(Math.sqrt(max * max + max * max));
      return diameter / 2;
    }

    class StarBg {
      orbitRadius: number;
      radius: number;
      orbitX: number;
      orbitY: number;
      timePassed: number;
      speed: number;
      alpha: number;

      constructor() {
        this.orbitRadius = randomBg(maxOrbitBg(wBg, hBg));
        this.radius = randomBg(60, this.orbitRadius) / 12;
        this.orbitX = wBg / 2;
        this.orbitY = hBg / 2;
        this.timePassed = randomBg(0, maxStarsBg);
        this.speed = randomBg(this.orbitRadius) / 60000;
        this.alpha = randomBg(2, 10) / 10;
        countBg++;
        starsBg[countBg] = this;
      }

      draw() {
        const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
        const twinkle = randomBg(10);

        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05;
        }

        ctxBg!.globalAlpha = this.alpha;
        ctxBg!.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
      }
    }

    for (let i = 0; i < maxStarsBg; i++) {
      new StarBg();
    }

    const animationBg = () => {
      ctxBg!.globalCompositeOperation = 'source-over';
      ctxBg!.globalAlpha = 0.8;
      ctxBg!.fillStyle = `hsla(${hueBg}, 64%, 6%, 1)`;
      ctxBg!.fillRect(0, 0, wBg, hBg);

      ctxBg!.globalCompositeOperation = 'lighter';
      for (let i = 1, l = starsBg.length; i < l; i++) {
        starsBg[i].draw();
      }

      requestAnimationFrame(animationBg);
    }

    animationBg();
  }

  initForegroundAnimation() {
    const canvasFg = this.canvasFgRef.nativeElement;
    const ctxFg = canvasFg.getContext('2d');
    if (!ctxFg) return;

    const wFg = canvasFg.width = window.innerWidth;
    const hFg = canvasFg.height = window.innerHeight-90;
    let starsFg: StarFg[] = [];
    let spiralsFg: any[] = [];
    let tickFg = 0;

    class StarFg {
      angle: number;
      radius: number;
      speed: number;
      x: number;
      y: number;
      size: number;
      hue: number;
      saturation: number;
      lightness: number;
      alpha: number;

      constructor(opt: Partial<StarFg>) {
        Object.assign(this, opt);
        this.angle = randFg(0, 10 * Math.PI);
        this.radius = randFg(200, 30);
        this.speed = randFg(0.001, 0.013);
        this.x = opt.x ?? 0;
        this.y = opt.y ?? 0;
        this.size = opt.size ?? 1;
        this.hue = opt.hue ?? 0;
        this.saturation = opt.saturation ?? 100;
        this.lightness = opt.lightness ?? 100;
        this.alpha = opt.alpha ?? 1;
      }

      update() {
        this.angle += this.speed;
        this.x = wFg / 2 + this.radius * Math.cos(this.angle);
        this.y = hFg / 2 + this.radius * Math.sin(this.angle);
      }

      draw() {
        ctxFg!.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
        ctxFg!.beginPath();
        ctxFg!.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctxFg!.fill();
      }
    }

    function randFg(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const initFg = () => {
      starsFg = [];
      spiralsFg = [];
      tickFg = 0;
      resetFg();
      loopFg();
    }

    const resetFg = () => {
      starsFg.length = 0;
      for (let i = 0; i < 300; i++) {
        const hue = randFg(200, 240); // Blue to white range
        const saturation = randFg(50, 100); // High saturation for brightness
        const lightness = randFg(80, 100); // Light colors for stars
        starsFg.push(new StarFg({
          size: randFg(1, 3),
          hue: hue,
          saturation: saturation,
          lightness: lightness,
          alpha: randFg(0.7, 1)
        }));
      }
    }

    const stepFg = () => {
      starsFg.forEach(star => star.update());
      spiralsFg.forEach(spiral => spiral.update());
    }

    const drawFg = () => {
      ctxFg!.clearRect(0, 0, wFg, hFg); // Clear previous frame

      // Draw the image for the eye background
      const eyeImage = new Image();
      eyeImage.src = 'https://i.ibb.co/hRmgpJY/eye.png';
      eyeImage.onload = function() {
        const eyeWidth = 120;
        const eyeHeight = 120;
        const eyeX = (wFg - eyeWidth) / 2;
        const eyeY = (hFg - eyeHeight) / 2;

        ctxFg!.save();
        // Create a circular clipping mask
        ctxFg!.beginPath();
        ctxFg!.arc(wFg / 2, hFg / 2, 50, 0, Math.PI * 2); // Define a circle centered at the canvas center
        ctxFg!.closePath();
        ctxFg!.clip();

        // Draw the image within the clipping mask
        ctxFg!.drawImage(eyeImage, eyeX, eyeY, eyeWidth, eyeHeight);
        ctxFg!.restore();

        // Draw stars and spirals
        starsFg.forEach(star => star.draw());
      };
    }

    const loopFg = () => {
      requestAnimationFrame(loopFg);
      stepFg();
      drawFg();
    }

    initFg();
  }
  get newProgressPercentage() {
    return (this.newProgressCount / this.maxNewProgress) * 100;
  }
  onCollectClick() {
    if (this.newProgressCount <= this.maxNewProgress) {
      this.buttonPressCount += this.newProgressCount;
      this.collectService.addButtonPressCount(this.newProgressCount);
      this.collectService.resetNewProgressCount();
      this.newProgressCount = 0; // Reset new progress after collecting
      this.telegramServices.hapticFeedback.impactOccurred('medium');
    }
  }

}
