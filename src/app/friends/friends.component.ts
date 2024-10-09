import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { CommonService } from '../common.service';
import { Friend, postDataInterface } from '../../core/interface/user';
import { PostDataService } from '../../core/services/post-data.service';
import { CollectService } from '../../core/services/collect.service';
import { trigger, style, animate, transition ,query,stagger} from '@angular/animations';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule,NgIf],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }), // Start with opacity 0 and slide up from below
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // Animate to visible state and original position
      ])
    ]),
  trigger('imageRotate', [
      transition(':enter', [
        style({ transform: 'rotate(0deg)', opacity: 0 }),
        animate('1s ease-in-out', style({ transform: 'rotate(360deg)', opacity: 1 })) // Rotate 360 degrees and fade in
      ])
    ]),  
    trigger('listAnimation', [
      transition(':enter', [
        query('.friend-card', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('tabHeaderAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    // Highlight bar animation for active tab
    trigger('highlightAnimation', [
      transition(':enter', [
        style({ width: '0%', backgroundColor: 'rgba(255, 193, 7, 0.5)' }), // Start with no width and light highlight
        animate('0.4s ease-out', style({ width: '100%', backgroundColor: 'rgba(255, 193, 7, 1)' })) // Full highlight bar
      ]),
      transition(':leave', [
        animate('0.4s ease-in', style({ width: '0%' })) // Shrink highlight when tab is not active
      ])
    ]),
      trigger('buttonAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }), // Initial state (scaled down, invisible)
        animate('0.5s ease-out', style({ transform: 'scale(1)', opacity: 1 })) // Final state (scaled up, visible)
      ])
    ])
  ]
})
export class FriendsComponent implements OnInit {
  userInfo:any;
  isCardAnimationDone = false
  isChallengesTabActive=false;
  totalRewards:number=0;
  source:string='';
  constructor() {}
  public commonService = inject(CommonService);
  private postDataService = inject(PostDataService);
  private route=inject(ActivatedRoute) 
  public router = inject(Router);
  private readonly telegramServices = inject(TelegramWebappService);
  activeTab: string = 'tasks'; // Set default active tab
  friendsList:Friend[]= [];
  onCardAnimationDone() {
    // This method is triggered after the card animation is complete
    this.isCardAnimationDone = true;
  }

  showTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'challenges') {
      this.isChallengesTabActive = true;
      this.callReferred();
    } else {
      this.isChallengesTabActive = false;
    }
    // Update the active class for the tab headers
    const tasksTab = document.getElementById('tasks-tab');
    const challengesTab = document.getElementById('challenges-tab');

    if (tasksTab && challengesTab) {
      if (tab === 'tasks') {
        tasksTab.classList.add('active');
        challengesTab.classList.remove('active');
      } else {
        tasksTab.classList.remove('active');
        challengesTab.classList.add('active');
      }
    }

    // Update the content visibility
    const tasksContent = document.getElementById('tasks-content');
    const challengesContent = document.getElementById('challenges-content');

    if (tasksContent && challengesContent) {
      if (tab === 'tasks') {
        tasksContent.classList.add('active');
        challengesContent.classList.remove('active');
      } else {
        tasksContent.classList.remove('active');
        challengesContent.classList.add('active');
      }
    }
  }
  callReferred(){
    const postData: postDataInterface = {
      Mode: 1, // Mode depending on your logic
      CrudType: 1, // Example value
      FetchData: [{
        mode:0,
        telegramId: this.userInfo.telegramId,
      }],
    };
    this.postDataService.sendData('Login',postData).subscribe(
      (response) => {
        if(response.StatusCode==200){
          if(response.Result){
            this.friendsList=response.Result?.friends??[];
            this.totalRewards = response?.Result?.Totalrewards?.[0]?.total_referral_reward ??0
          }
        }
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }
  getAvatarUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
  ngOnInit() {
    this.userInfo=this.commonService.getUserInfo();
    this.route.queryParams.subscribe(params => {
      const source = params['source'];
      if (source) {
        this.source = source;
        this.enableBackButton();
      }
    });
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
  shareOnTelegram() {
    // Generate the bot join link with a referral code
    const urlToShare = encodeURIComponent(`https://t.me/Nila_Coin_Bot?start=referral_${this.userInfo.telegramId}`);
    const textToShare = encodeURIComponent('Join Nila Coin Bot and earn rewards!');

    // Create the Telegram share URL
    const telegramShareUrl = `https://t.me/share/url?url=${urlToShare}&text=${textToShare}`;
    
    // Open the share URL in a new tab
    window.open(telegramShareUrl, '_blank');
  }
}
