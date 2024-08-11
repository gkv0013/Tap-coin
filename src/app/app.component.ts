import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { CommonService } from './common.service';
import { UserData } from '../core/interface/user';
import { Subscription } from 'rxjs';
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
  imports: [RouterOutlet, NgClass, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Nila';
  isCollectSection: boolean = false;
  userInfo: any;
  profilePhotos: any;
  userData: UserData = {
    id: '',
    username: '',
    email: '',
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
    achievements: [],
    preferences: {
      notifications: true,
    },
  };
  activeTab: string = 'collect';
  progressValue: number = 25;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  private readonly telegramServices = inject(TelegramWebappService);
  public router = inject(Router);
  public commonService = inject(CommonService);
  //private readonly userService = inject(UserService);
  platformInfo: any;

  private subscriptions: Subscription[] = [];
  ngOnInit() {
    this.telegramServices.
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
    console.log(this.telegramServices.initDataUnsafe?.user);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.scrollTo(0, 0); // Force scroll position to reset
        }, 0);
      }
    });
    const viewportChangedSubscription = this.telegramServices.onEvent('viewport_changed' as any).subscribe(params => {
      this.handleViewportChange(params);
    });
    
    this.subscriptions.push(viewportChangedSubscription);
  }
  handleViewportChange(params: any) {
    const appContainer = this.el.nativeElement.querySelector('router-outlet') as HTMLElement;

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
    // this.userService.getUser(userId).subscribe((data: UserData | null) => {
    //   if (data) {
    //     this.userData = data;
    //   } else {
    //     const telegramUser = this.telegramServices.initDataUnsafe?.user;
    //     if (telegramUser) {
    //       this.userData.id = String(telegramUser.id);
    //       this.userData.username = telegramUser.username ?? '';
    //       this.userData.createdAt = new Date();
    //       this.saveUserData();
    //     }
    //   }
    // });
  }
  saveUserData() {
    // this.userData.lastLogin = new Date();
    // this.userService.userExists(this.userData.id).subscribe(
    //   (exists) => {
    //     if (exists) {
    //       this.userService
    //         .updateUser(this.userData.id, this.userData)
    //         .subscribe(
    //           () => {
    //             console.log('User data updated successfully');
    //           },
    //           (error) => {
    //             console.error('Error updating user data: ', error);
    //           }
    //         );
    //     } else {
    //       this.userService.createUser(this.userData).subscribe(
    //         () => {
    //           console.log('User data created successfully');
    //         },
    //         (error) => {
    //           console.error('Error creating user data: ', error);
    //         }
    //       );
    //     }
    //   },
    //   (error) => {
    //     console.error('Error checking user existence: ', error);
    //   }
    // );
  }
  navigateTo(route: string): void {
    this.activeTab=route;
    this.router.navigate([`/${route}`]);
    this.telegramServices.hapticFeedback.impactOccurred('light');
    if (route == 'airdrop') {
      this.telegramServices
        .showPopup({ message: 'Comming Soon' })
        .subscribe((airdrop) => {
          console.log(airdrop);
        });
    }
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.telegramServices.sendData({ key: 'Onu Podai' });
  }

  showSection(sectionId: string, btn: EventTarget | null) {
    this.navigateTo(sectionId);
   
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
  
}