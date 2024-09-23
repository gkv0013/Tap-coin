import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { CommonService } from './common.service';
import { postDataInterface, UserData } from '../core/interface/user';
import { Subscription } from 'rxjs';
import { PostDataService } from '../core/services/post-data.service';

import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CollectService } from '../core/services/collect.service';
import { LoadingComponent } from './loading/loading.component';
import { environment } from '../environment/environment';
import { DayCheckerService } from '../core/services/day-checker.service';
//import { UserService } from '../core/services/user.service';
declare global {
  interface Window {
    Telegram: any;
  }
}
interface InitUserData {
  id: string;
  username: string;
  createdAt: Date;
  // Add any other properties that your `UserData` object should have
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf,NgFor,LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[BsModalService]
})
export class AppComponent implements OnInit, OnDestroy {
  bsModalRef?: BsModalRef;
  private isProduction = environment.production; 
  title = 'Nila';
  isCollectSection: boolean = false;
  currentCoinIndex = 0;
  userInfo: any;
  profilePhotos: any;
  isLoading = true;
  userData: UserData = {
    id: '',
    username: '',
    createdAt: new Date(),
    lastLogin: new Date(),
    coinCounter: 0,
    nextLevel: 5000,
    profitPerTap: 1,
    profitPerHour: 0,
    buttonPressCount: 0,
    totalCoins: 0,
    friendsInvited: 0,
    referralBonus: 0,
    dailyLoginStreak: 0,
    firstname: '',
    lastname: '',
    achievements: []
  };
  currentImageIndex = 0;

  coins :any;
  
  platformInfo: string = '';
  selectedButton: HTMLElement | null = null;
  activeTab: string = 'collect';
  progressValue: number = 25;
  buttonPressCount = 0;
  isMobilePlatform: boolean = false
  constructor() {}
  private subscriptions: Subscription[] = [];
  private el = inject(ElementRef);
  private postDataService = inject(PostDataService);
  private modalService = inject(BsModalService);
  private readonly telegramServices = inject(TelegramWebappService);
  private readonly  = inject(TelegramWebappService);
  public router = inject(Router);
  public commonService = inject(CommonService);
  private collectService = inject(CollectService);
  private  dayCheckerService = inject(DayCheckerService);

  ngOnInit() {
    if(this.isProduction){
      this.platformInfo = this.telegramServices.platform;
      this.isMobilePlatform = this.platformInfo === 'mobile' || this.platformInfo === 'android' || this.platformInfo === 'ios';
      if (!this.isMobilePlatform) {
        return;
      } 
    }else{
      this.isMobilePlatform =true;
    }

    this.commonService.activeTab$.subscribe(tab => {
      this.activeTab = tab;
    });
    this.userData = {
      id: '1918120254',  // Example user ID
      username: 'albatrosszz',  // Example username
      firstname: 'Manu',  // Example first name
      lastname: 'Krishna',  // Example last name
      createdAt: new Date(),  // Example account creation date
      lastLogin: new Date(),  // Example last login date (current date and time)
      profitPerTap: 0,  // Example profit per tap
      profitPerHour: 0,  // Example profit per hour
      buttonPressCount: 50,  // Example button press count
      totalCoins: 0,  // Example total coins
      friendsInvited: 0,  // Example number of friends invited
      referralBonus: 0,  // Example referral bonus
      dailyLoginStreak: 0,  // Example daily login streak
      coinCounter: 0,  // Example coin counter
      nextLevel: 5000,  // Example next level threshold
      achievements: ['First Tap', 'Invite 5 Friends'],  // Example achievements array
    };
    this.telegramServices.ready();
    this.telegramServices.setHeaderColor('#000000'); // Dark header color
    this.telegramServices.setBackgroundColor('#1a1a1a'); // Dark background color
    const telegramUser = this.telegramServices.initDataUnsafe?.user;
    if (telegramUser) {
      this.loadUserData(telegramUser);
    }
    else{
      this.loadUserData(this.userData);
    }
    console.log(this.telegramServices.initDataUnsafe?.user);
    this.telegramServices.expand();
    this.subscriptions.push(this.collectService.getButtonPressCount().subscribe(count => this.buttonPressCount = count))
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.navigateTo(tab);
  }
  loadUserData(telegramUser: any) {
    const postData: postDataInterface = {
      Mode: 0, // Mode depending on your logic
      CrudType: 1, // Example value
      FetchData: [{
        mode:0,
        id: telegramUser.id,
        username: telegramUser.username,
        firstname: telegramUser.first_name??'',
        lastname: telegramUser.last_name??'',
        createdAt: this.userData.createdAt,
        lastLogin: this.userData.lastLogin,
        profitPerTap: this.userData.profitPerTap,
        profitPerHour: this.userData.profitPerHour,
        buttonPressCount: this.userData.buttonPressCount,
        totalCoins: this.userData.totalCoins,
        friendsInvited: this.userData.friendsInvited,
        referralBonus: this.userData.referralBonus,
        dailyLoginStreak: this.userData.dailyLoginStreak,
        time: new Date().toISOString()
      }],
    };

    this.postDataService.sendData('Login',postData).subscribe(
      (response) => {
        if(response.StatusCode==200){
          const newProgressCount = localStorage.getItem('newProgressCount');
          const currentEnergy = localStorage.getItem('currentEnergy');
          if(currentEnergy){
            this.collectService.setCurrentEnergy(Number(currentEnergy));
            this.collectService.startEnergyRegen();
          }
          if(newProgressCount){
            this.collectService.setNewProgressCount(Number(newProgressCount));
          }
          this.commonService.setUserInfo(response.Result?.result?.[0])
          this.userInfo=response.Result?.result?.[0];
          this.collectService.setButtonPressCount(this.userInfo?.totalCoins || 0);
          let coinsetting=JSON.parse(response.Result?.cointsettings?.[0]?.settingdata);
          this.collectService.setCoinsetting(coinsetting)
          this.coins= this.collectService.getCoinsetting();
          let isenergyboost = response?.Result?.result[0]?.isenergyboost;
          if (isenergyboost) {
            let energyBoost: number = this.getEnergyBoost() ?? 1;
            if (energyBoost > 0) {
              this.collectService.setEnergyIncrement(energyBoost);
            }
          }
          let ismultitap = response?.Result?.result[0]?.ismultitap
          if (ismultitap) {
            let multitap: number = this.getmultitap() ?? 1;
            if (multitap > 0) {
              this.collectService.setProfitPerTap(multitap);
            }
          }
          setTimeout(() => {
            this.isLoading = false;
            this.commonService.setActiveTab('collect');
            this.router.navigate(['/collect'])
          }, 1000);
          
        }
        console.log('Data saved successfully:', response);
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }
  getEnergyBoost(): number {
    const currentCoinTier = this.coins.find(
      (coin: any) => this.buttonPressCount >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.energyboost : 0;
  }
  getmultitap(): number {
    const currentCoinTier = this.coins.find(
      (coin: any) => this.buttonPressCount >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.multitap : 1;
  }
  getCurrentCoinTitle(totalCoins: number): string {
    const sortedCoins = [...this.coins].sort((a, b) => b.progress - a.progress);
    const coin = sortedCoins.find(coin => totalCoins >= coin.progress);
    return coin ? coin.title : 'Bronze';
  }

  getCoinClass(totalCoins: number): string {
    const sortedCoins = [...this.coins].sort((a, b) => b.progress - a.progress);
    const coin = sortedCoins.find(c => totalCoins >= c.progress);
    return coin ? coin.title.toLowerCase() : 'bronze'; 
  }
  getAvatarUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }

  showSection(sectionId: string, button: EventTarget | null): void {
      this.navigateTo(sectionId);
      this.activeTab=sectionId;
  }
  navigateTo(route: string): void {
    this.activeTab = route;
    this.router.navigate([`/${route}`]).then(() => {
      this.telegramServices.hapticFeedback.impactOccurred('medium');
    }).catch((err) => {
      console.error('Navigation failed:', err);
    });
  }
  
  openModal(template: TemplateRef<any>) {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
    this.bsModalRef = this.modalService.show(template);
    this.currentImageIndex=0
  }

  closeModal() {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
  nextImage() {
    if (this.currentImageIndex < this.coins.length - 1) {
      this.currentImageIndex++;
      this.preloadImage(this.currentImageIndex + 1);
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.preloadImage(this.currentImageIndex - 1);
    }
  }
  preloadImage(index: number) {
    if (index >= 0 && index < this.coins.length) {
      const img = new Image();
      img.src = this.coins[index].image;
    }
  }
}



