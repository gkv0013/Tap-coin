  import { CommonModule } from '@angular/common';
  import { Component, ElementRef, AfterViewInit, Renderer2, ViewChild, inject, OnDestroy, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
  import { CommonService } from '../common.service';
  import { CollectService } from '../../core/services/collect.service';
  import { Subscription } from 'rxjs';
  import { postDataInterface } from '../../core/interface/user';
  import { PostDataService } from '../../core/services/post-data.service';
  import { trigger, style, animate, transition} from '@angular/animations';
  import confetti from 'canvas-confetti';
import { HopscotchService } from '../../core/services/hopscotch.service';
  @Component({
    selector: 'app-collect',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './collect.component.html',
    styleUrls: ['./collect.component.css'],
    animations: [
     trigger('buttonAnimation', [
        transition(':enter', [
          style({ transform: 'scale(0)', opacity: 0 }), // Initial state (scaled down, invisible)
          animate('0.5s ease-out', style({ transform: 'scale(1)', opacity: 1 })) // Final state (scaled up, visible)
        ])
      ])
    ]
  })
  export class CollectComponent implements AfterViewInit,OnDestroy,OnInit {
    nextLevel = 5000;
    profitPerTap = 1;
    profitPerHour = 0;
    previousLevel: number = 0; // Initialize the current level to 0
    buttonPressCount = 0;
    newProgressCount = 0; // New variable for tracking progress
    maxNewProgress = 100;
    currentEnergy = 1000; // Current energy value
    maxEnergy = 110; // Maximum energy value
    shouldShakeBoostIcons = false;
    shouldShakeClaimIcons=false;
    timerDuration = 60; // Timer duration in seconds (1 minute)
    timeRemaining = 0; // Time remaining for the timer
    isTimerRunning = false;
    coins :any;
    
    @ViewChild('roundButton') roundButton!: ElementRef;
    @ViewChild('coinContainer') coinContainer!: ElementRef;
    @ViewChild('canvasBg') canvasBgRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasFg') canvasFgRef!: ElementRef<HTMLCanvasElement>;
    public router = inject(Router);
    private readonly telegramServices = inject(TelegramWebappService);
    private readonly renderer = inject(Renderer2);
    public commonService = inject(CommonService);
    private route=inject(ActivatedRoute) 
    private readonly collectService = inject(CollectService);
    public hopscotchService = inject(HopscotchService);
    private subscriptions: Subscription[] = [];
    private postDataService = inject(PostDataService);
    source:string='';
    userInfo:any;
    getBoostValue(): number {
      const currentCoinTier = this.coins.find((coin:any) => this.buttonPressCount >= coin.progress);
      return currentCoinTier ? currentCoinTier.boost : 0;
    }
    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        const source = params['source'];
        if (source) {
          this.source = source;
          this.enableBackButton();
        }
      });
    this.initSubscriptions();
    this.coins=this.collectService.getCoinsetting();
    this.collectService.startProgressDecrease();
    this.userInfo=this.commonService.getUserInfo();
    this.previousLevel=this.getCurrentLevel();
    }
    enableBackButton() {
      this.telegramServices.backButton.show();  
      if (Telegram.WebApp && Telegram.WebApp.BackButton) {
        Telegram.WebApp.BackButton.onClick(() => {
          console.log('Back button clicked');
          this.handleBackNavigation();
        });
      }
    }
    handleBackNavigation() {
      this.commonService.setActiveTab(this.source);
      this.router.navigate([`/${this.source}`]);
      this.hideBackButton();
    }
    hideBackButton() {
      this.telegramServices.backButton.hide();  
    }
    initSubscriptions(){
      this.subscriptions.push(
        this.collectService.getButtonPressCount().subscribe(count => this.buttonPressCount = count),
        this.collectService.getNewProgressCount().subscribe(count => this.newProgressCount = count),
        this.collectService.getMaxNewProgress().subscribe(max => this.maxNewProgress = max),
        this.collectService.getCurrentEnergy().subscribe(energy => this.currentEnergy = energy),
        this.collectService.getTimeRemaining().subscribe(time => this.timeRemaining = time),
        this.collectService.getProfitPerTap().subscribe(tap => this.profitPerTap = tap),
        this.collectService.isTimerCurrentlyRunning().subscribe(running => {
          this.isTimerRunning = running;
          if (running) {
          // this.collectService.startTimer(this.telegramServices);
          }
        })
      );
    }
    ngAfterViewInit(): void {
      this.initBackgroundAnimation();
      this.initForegroundAnimation();
      this.startTour();
    }

    startTour(){
      const steps = [
        {
          target: this.roundButton.nativeElement,
          title: '🎯 Press here',
          content: '<strong>Click here</strong> to earn media credits and start your journey to success!',
          placement: 'bottom',
          arrowOffset: 'center',
          delay: 500,
          zindex: 9999,
          showCTAButton: true,
          ctaLabel: 'Got it!',
          onNext: () => {
            const userData=this.commonService.getUserInfo();
            userData.isNewUser=0;
            this.commonService.setUserInfo(userData);
          },
        },
        {
          target: document.getElementById('boost-container'),
          title: '⚡ Boost your energy',
          content: 'Click here to <em>boost</em> your energy levels and stay in the game!',
          placement: 'left',
          arrowOffset: 'top-right',
          zindex: 9999,
          showCTAButton: true,
          ctaLabel: 'Let’s go!',
          onNext: () => {
            const userData=this.commonService.getUserInfo();
            userData.isNewUser=0;
            this.commonService.setUserInfo(userData);
          },
        }
      ];
  
      // Create the tour
     if(this.userInfo.isNewUser==1){
      setTimeout(() => {
        const tour = this.hopscotchService.defineTour(steps);
        
        this.hopscotchService.startTour(tour);
      }, 3000);
     }
    }
    getCurrentLevel(): number {
      // Sort coins by progress in descending order so that higher levels are checked first
      const sortedCoins = [...this.coins].sort((a, b) => b.progress - a.progress);
      
      // Find the highest coin tier where buttonPressCount >= progress
      const currentCoinTier = sortedCoins.find(
        (coin: any) => this.buttonPressCount >= coin.progress
      );
      
      return currentCoinTier ? currentCoinTier.level : 0; // Return 0 if no level is found
    }
    
    
    ngOnDestroy() {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    getFormattedTimeUTC(seconds: number): string {
      const date = new Date(0); // Epoch time
      date.setSeconds(seconds);
      return date.toISOString().substr(14, 5); // Get mm:ss part of the ISO string
    }
    getclaimlimit(): number {
      const currentCoinTier = this.coins.find(
        (coin: any) => this.buttonPressCount >= coin.progress
      );
      return currentCoinTier ? currentCoinTier.claimlimit : 50;
    }
    
    onButtonClick(event: MouseEvent) {
      if (this.newProgressCount < this.maxNewProgress && this.currentEnergy >= 1) {
        this.newProgressCount = Math.min(this.newProgressCount + this.profitPerTap, this.getclaimlimit());
        this.currentEnergy--; // Decrease energy on button click
        this.telegramServices.hapticFeedback.impactOccurred('medium');
        const button = this.roundButton.nativeElement;
        button.classList.add('pulse');
        this.collectService.incrementNewProgressCount();
        this.collectService.decrementCurrentEnergy();
        this.collectService.stopProgressDecrease(); // Stop the decrease timer
        this.collectService.resetProgressDecreaseAfterInactivity();
        this.createFallingCoin();
        setTimeout(() => {
          button.classList.remove('pulse');
        }, 1000);
      } 
      else if(this.currentEnergy < 1){
        this.shouldShakeBoostIcons = true;
        setTimeout(() => {
          this.shouldShakeBoostIcons = false;
        }, 500);
      }
        else {
          this.shouldShakeClaimIcons = true;
          setTimeout(() => {
            this.shouldShakeClaimIcons = false;
          }, 500);
      }
    }
    checkForLevelUp() {
      const currentTier = this.getCurrentCoinTier();
      const currentLevel = currentTier.level;
    
      // Check if user has leveled up
      if (currentLevel > this.previousLevel) {
        this.triggerConfetti();
        this.previousLevel = currentLevel; // Update the previous level after confetti
      }
    }
    onLevelUp(newLevel: number) {
      console.log('Congratulations! You have reached level ' + newLevel);
      this.triggerConfetti(); // Optionally, trigger confetti animation
      // You can display a message or perform any other actions here
    }
    triggerConfetti() {
      // Set the confetti duration (15 seconds)
      const duration = 5 * 1000; // 15 seconds
      const colors = ['#bb0000', '#ffffff']; // Custom colors
    
      const interval = setInterval(() => {
        // Left side confetti
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
    
        // Right side confetti
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
      }, 100); // Frequency of confetti bursts (every 100ms)
    
      // Stop the confetti after the duration has passed
      setTimeout(() => {
        clearInterval(interval); // Stop the interval after the duration
      }, duration);
    }
    
    getCurrentCoinTier(): any {
      let currentTier = this.coins[0]; // Default to the first tier (Newbie)
    
      // Loop through the tiers and find where buttonPressCount falls
      for (let i = 0; i < this.coins.length; i++) {
        const coin = this.coins[i];
        const nextCoin = this.coins[i + 1]; // Get the next tier for comparison
    
        if (nextCoin) {
          // Check if the buttonPressCount is between this tier and the next
          if (this.buttonPressCount >= coin.progress && this.buttonPressCount < nextCoin.progress) {
            currentTier = coin;
            break;
          }
        } else {
          // If there is no next tier, we're at the last tier
          if (this.buttonPressCount >= coin.progress) {
            currentTier = coin;
            break;
          }
        }
      }
    
      return currentTier;
    }
    
    routeToBoost(){
        this.commonService.setActiveTab('boost');
        this.router.navigate(['/boost']);
    }
    get currentCoin() {
      return this.coins.find((coin:any) => this.buttonPressCount < coin.progress) || this.coins[this.coins.length - 1];
    }

    get progressPercentage() {
      const currentCoin = this.currentCoin;
      const previousCoin = this.coins[this.coins.indexOf(currentCoin) - 1] || { progress: 0 }; 
      const progressRange = currentCoin.progress - previousCoin.progress;
      const progressInRange = this.buttonPressCount - previousCoin.progress;
      
      return (progressInRange / progressRange) * 100;
    }

    createFallingCoin() {
      const coin = this.renderer.createElement('div');
      this.renderer.addClass(coin, 'coin');
      this.renderer.addClass(coin, 'fall');
    
      // Add profitPerTap inside the coin
      const profitPerTapText = this.renderer.createText(`+${this.profitPerTap}`);
      this.renderer.appendChild(coin, profitPerTapText);
    
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
    

    get newProgressPercentage() {
      return (this.newProgressCount / this.maxNewProgress) * 100;
    }
    onCollectClick() {
      if (this.newProgressCount <= this.maxNewProgress) {
        this.buttonPressCount += this.newProgressCount;
        this.saveCoins(this.newProgressCount)
        this.collectService.resetNewProgressCount();
        this.collectService.startProgressDecrease();
        this.newProgressCount = 0; 
        this.checkForLevelUp();
        this.telegramServices.hapticFeedback.impactOccurred('medium');
      }
    }
    saveCoins(claim:number) {
      const postData: postDataInterface = {
        Mode: 1, 
        CrudType: 0,
        SaveData: {'collect':[{
          mode:1,
          id: this.userInfo.telegramId,
          claim: claim,
        }]},
      };
  
      this.postDataService.sendData('Login',postData).subscribe(
        (response) => {
          if(response.StatusCode==200){
           if(response?.Result?.length>0){
            let claim:number=response?.Result?.[0]?.totalCoins;
            if(claim){
              this.collectService.addButtonPressCount(claim);
            }
           }
          }
        },
        (error) => {
          console.error('Error saving data:', error);
        }
      );
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
  }
