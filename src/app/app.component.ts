import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { CommonService } from './common.service';
import { postDataInterface, UserData } from '../core/interface/user';
import { Subscription } from 'rxjs';
import { PostDataService } from '../core/services/post-data.service';
import { ModalService } from '../core/services/modal.service';
//import { BsModalService, BsModalRef,ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CollectService } from '../core/services/collect.service';
import { LoadingComponent } from './loading/loading.component';
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

  coins = [
    {
      image: '/image/newbie.jpeg',
      title: 'Newbie',
      description: 'Starting your journey.',
      progress: 0,
      color: 'linear-gradient(135deg, #a9a9a9, #dcdcdc)' // Newbie gradient
    },
    {
      image: '/image/bronze.jpeg',
      title: 'Bronze',
      description: 'Your number of shares determines the league you enter.',
      progress: 5000,
      color: 'linear-gradient(135deg, #654321, #d7b89e)' // Bronze gradient
    },
    {
      image: '/image/silver.jpeg',
      title: 'Silver',
      description: 'Your number of shares determines the league you enter.',
      progress: 50000,
      color: 'linear-gradient(135deg, #C0C0C0, #e5e5e5)' // Silver gradient
    },
    {
      image: '/image/gold.jpeg',
      title: 'Gold',
      description: 'Your number of shares determines the league you enter.',
      progress: 500000,
      color: 'linear-gradient(135deg, #FFD700, #FFEB3B)' // Gold gradient
    },
    {
      image: '/image/platina.jpeg',
      title: 'Platina',
      description: 'Your number of shares determines the league you enter.',
      progress: 1000000,
      color: 'linear-gradient(135deg, #E5E4E2, #d1d1d1)' // Platina gradient
    },
    {
      image: '/image/diamond.jpeg',
      title: 'Diamond',
      description: 'Your number of shares determines the league you enter.',
      progress: 2500000,
      color: 'linear-gradient(135deg, #b9f2ff, #80e0ff)' // Diamond gradient
    },
    {
      image: '/image/master.jpeg',
      title: 'Master',
      description: 'Your number of shares determines the league you enter.',
      progress: 5000000,
      color: 'linear-gradient(135deg, #4b0082, #6a0dad)' // Master gradient
    }
  ];
  
  platformInfo: any;
  selectedButton: HTMLElement | null = null;
  activeTab: string = 'collect';
  progressValue: number = 25;
  buttonPressCount = 0;
  constructor() {}
  private el = inject(ElementRef);
  private postDataService = inject(PostDataService);
  private modalService = inject(BsModalService);
  private readonly telegramServices = inject(TelegramWebappService);
  private readonly  = inject(TelegramWebappService);
  public router = inject(Router);
  public commonService = inject(CommonService);
  private collectService = inject(CollectService);
  private subscriptions: Subscription[] = [];
  ngOnInit() {
    this.commonService.activeTab$.subscribe(tab => {
      this.activeTab = tab;
    });
    this.userData = {
      id: '12',  // Example user ID
      username: 'Dinkann',  // Example username
      firstname: 'John',  // Example first name
      lastname: 'Doe',  // Example last name
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
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     setTimeout(() => {
    //       window.scrollTo(0, 0); // Force scroll position to reset
    //     }, 0);
    //   }
    // });
    // const viewportChangedSubscription = this.telegramServices
    //   .onEvent('viewport_changed' as any)
    //   .subscribe((params) => {
    //     this.handleViewportChange(params);
    //   });

    // this.subscriptions.push(viewportChangedSubscription);
    this.subscriptions.push(this.collectService.getButtonPressCount().subscribe(count => this.buttonPressCount = count))
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  handleViewportChange(params: any) {
    const appContainer = this.el.nativeElement.querySelector(
      'router-outlet'
    ) as HTMLElement;

    if (appContainer && params.height) {
      // Adjust the height of the container based on the viewport height
      appContainer.style.height = `${params.height}px`;
    }

    if (params.is_expanded) {
      console.log('App is expanded to full height.');
      // Further adjustments if needed
    } else {
      console.log('App is not expanded to full height.');
      // Additional adjustments if needed
    }

    if (!params.is_state_stable) {
      console.log('Viewport resizing is still in progress.');
    }
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
      }],
    };

    this.postDataService.sendData('Login',postData).subscribe(
      (response) => {
        if(response.StatusCode==200){
          this.commonService.setUserInfo(response.Result?.[0])
          this.userInfo=response.Result?.[0];
          this.collectService.setButtonPressCount(this.userInfo?.totalCoins || 0);
          
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



