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
  imports: [RouterOutlet, NgClass, NgIf,NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[BsModalService]
})
export class AppComponent implements OnInit, OnDestroy {
  bsModalRef?: BsModalRef;
  title = 'Nila';
  isCollectSection: boolean = false;
  userInfo: any;
  profilePhotos: any;
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
  images = [
    '/image/bronze.jpeg',
    '/image/silver.jpeg',
    '/image/gold.jpeg',
    '/image/platina.jpeg',
    '/image/diamond.jpeg',
       '/image/master.jpeg'
  ];
  titles = ['Bronze', 'Silver', 'Gold','Platina','Diamond','Master'];
  descriptions = [
    'From 1000',
    'From 50000',
    'From 500000',
    'From 1000000',
    'From 2500000',
    'From 5000000'
  ];
  coins = [
    {
      image: '/assets/images/bronze.png',
      title: 'Bronze',
      description: 'Your number of shares determines the league you enter.',
      progress: '112 / 1000'
    },
    {
      image: '/assets/images/silver.png',
      title: 'Silver',
      description: 'Your number of shares determines the league you enter.',
      progress: 'From 50,000'
    },
    {
      image: '/assets/images/gold.png',
      title: 'Gold',
      description: 'Your number of shares determines the league you enter.',
      progress: 'From 500,000'
    },
    {
      image: '/assets/images/platina.png',
      title: 'Platina',
      description: 'Your number of shares determines the league you enter.',
      progress: 'From 1,000,000'
    },
    {
      image: '/assets/images/diamond.png',
      title: 'Diamond',
      description: 'Your number of shares determines the league you enter.',
      progress: 'From 2,500,000'
    },
    {
      image: '/assets/images/master.png',
      title: 'Master',
      description: 'Your number of shares determines the league you enter.',
      progress: 'From 5,000,000'
    }
  ];
  
  activeTab: string = 'collect';
  progressValue: number = 25;
  constructor(private renderer: Renderer2, private el: ElementRef, private postDataService: PostDataService,private modalService: BsModalService) {}
  private readonly telegramServices = inject(TelegramWebappService);
  public router = inject(Router);
  public commonService = inject(CommonService);
  //private readonly userService = inject(UserService);
  platformInfo: any;
  selectedButton: HTMLElement | null = null;
  private subscriptions: Subscription[] = [];
  ngOnInit() {
    this.commonService.activeTab$.subscribe(tab => {
      this.activeTab = tab;
    });
    this.userData = {
      id: '123456',  // Example user ID
      username: 'john_doe',  // Example username
      firstname: 'John',  // Example first name
      lastname: 'Doe',  // Example last name
      createdAt: new Date('2024-01-01T10:00:00Z'),  // Example account creation date
      lastLogin: new Date(),  // Example last login date (current date and time)
      profitPerTap: 1.5,  // Example profit per tap
      profitPerHour: 10,  // Example profit per hour
      buttonPressCount: 50,  // Example button press count
      totalCoins: 1500,  // Example total coins
      friendsInvited: 10,  // Example number of friends invited
      referralBonus: 20.0,  // Example referral bonus
      dailyLoginStreak: 7,  // Example daily login streak
      coinCounter: 1000,  // Example coin counter
      nextLevel: 5000,  // Example next level threshold
      achievements: ['First Tap', 'Invite 5 Friends'],  // Example achievements array
    };

    this.telegramServices.ready();
    this.telegramServices.setHeaderColor('#000000'); // Dark header color
    this.telegramServices.setBackgroundColor('#1a1a1a'); // Dark background color

    const telegramUser = this.telegramServices.initDataUnsafe?.user;
    if (telegramUser) {
      this.loadUserData(String(telegramUser.id));
    }
    this.userInfo = this.telegramServices.initDataUnsafe?.user;
    if (this.userInfo) {
      this.loadUserData(this.userInfo.id);
      this.commonService.setUserInfo(this.userInfo);
    }
    else{
      this.loadUserData('123456');
    }
    console.log(this.telegramServices.initDataUnsafe?.user);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.scrollTo(0, 0); // Force scroll position to reset
        }, 0);
      }
    });
    const viewportChangedSubscription = this.telegramServices
      .onEvent('viewport_changed' as any)
      .subscribe((params) => {
        this.handleViewportChange(params);
      });

    this.subscriptions.push(viewportChangedSubscription);
    
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
  loadUserData(userId: string) {
    const postData: postDataInterface = {
      Mode: 0, // Mode depending on your logic
      CrudType: 1, // Example value
      FetchData: [{
        mode:0,
        id: this.userData.id,
        username: this.userData.username,
        firstname: this.userData.firstname,
        lastname: this.userData.lastname,
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
        console.log('Data saved successfully:', response);
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }
  claimCoin(){

  }
  saveUserData() {
   
  }
  getCurrentCoinTitle(totalCoins: number): string {
    if (totalCoins >= 5000000) {
      return 'Master';
    } else if (totalCoins >= 2500000) {
      return 'Diamond';
    } else if (totalCoins >= 1000000) {
      return 'Platina';
    } else if (totalCoins >= 500000) {
      return 'Gold';
    } else if (totalCoins >= 50000) {
      return 'Silver';
    } else {
      return 'Bronze';
    }
  }

  getCoinClass(totalCoins: number): string {
    if (totalCoins >= 5000000) {
      return 'master';
    } else if (totalCoins >= 2500000) {
      return 'diamond';
    } else if (totalCoins >= 1000000) {
      return 'platina';
    } else if (totalCoins >= 500000) {
      return 'gold';
    } else if (totalCoins >= 50000) {
      return 'silver';
    } else {
      return 'bronze';
    }
  }

  navigateTo(route: string): void {
    this.activeTab = route;
    this.router.navigate([`/${route}`]);
    this.telegramServices.hapticFeedback.impactOccurred('medium');
  }

  scrollActive() {
    const sections = this.el.nativeElement.querySelectorAll('section[id]');
    const scrollDown = window.scrollY;

    sections.forEach((current: any) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 58;
      const sectionId = current.getAttribute('id');
      const sectionsClass = this.el.nativeElement.querySelector(
        '.nav__list a[href*=' + sectionId + ']'
      );

      if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
        this.renderer.addClass(sectionsClass, 'active-link');
      } else {
        this.renderer.removeClass(sectionsClass, 'active-link');
      }
    });
  }
  private toggleClass(element: any, className: string) {
    if (element.classList.contains(className)) {
      this.renderer.removeClass(element, className);
    } else {
      this.renderer.addClass(element, className);
    }
  }
  getIconFill(tab: string): string {
    return this.activeTab === tab ? '#5ddcff ' : '#e8eaed';
  }
  ngOnDestroy() {
    // Send data to the bot
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.telegramServices.sendData({ key: 'Onu Podai' });
  }

  showSection(sectionId: string, button: EventTarget | null): void {
      this.navigateTo(sectionId);
      this.activeTab=sectionId;
  }
  
  

  showTab(tab: string) {
    const tabs = document.querySelectorAll('.tab-header div');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
    contents.forEach((content) => {
      content.classList.remove('active');
    });
    document.getElementById(tab + '-tab')?.classList.add('active');
    document.getElementById(tab + '-content')?.classList.add('active');
  }

  dropCoin() {
    const coin = document.getElementById('coin') as HTMLElement;
    const radialProgress = document.querySelector(
      '.RadialProgress'
    ) as HTMLElement;
    if (coin && radialProgress) {
      coin.style.top = `${
        radialProgress.offsetTop +
        radialProgress.offsetHeight / 2 -
        coin.offsetHeight / 2
      }px`;
      coin.style.left = `${
        radialProgress.offsetLeft +
        radialProgress.offsetWidth / 2 -
        coin.offsetWidth / 2
      }px`;
      coin.style.display = 'block';
      coin.classList.add('fall');
      setTimeout(() => {
        coin.style.display = 'none';
        coin.classList.remove('fall');
      }, 1000);
    }
  }

  setProgress(progress: number) {
    const value = `${progress}%`;
    const radialProgress = document.querySelector('.RadialProgress');
    if (radialProgress) {
      radialProgress.setAttribute('style', `--progress: ${value};`);
      radialProgress.innerHTML = value;
      radialProgress.setAttribute('aria-valuenow', value);
    }
  }

  onProgressChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.setProgress(parseInt(input.value, 10));
  }
  loadHalfAndExpand(): void {
    // Initially load the WebApp in half view
    this.telegramServices.close();
    // Delay before expanding to full view
    setTimeout(() => {
      this.telegramServices.expand();
    }, 3000); // Adjust the delay as needed
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
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.telegramServices.hapticFeedback.impactOccurred('light');
      this.preloadImage(this.currentImageIndex + 1);
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.telegramServices.hapticFeedback.impactOccurred('light');
      this.preloadImage(this.currentImageIndex - 1);
    }
  }
  preloadImage(index: number) {
    if (index >= 0 && index < this.images.length) {
      const img = new Image();
      img.src = this.images[index];
    }
  }
}



