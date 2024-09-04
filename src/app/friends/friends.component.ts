import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent {
  userInfo:any;
  constructor() {}
  public commonService = inject(CommonService);
  activeTab: string = 'tasks'; // Set default active tab
  friendsList = [
    {
      name: 'John Doe',
      avatar: '/image/avatar1.jpeg',
      points: 100
    },
    {
      name: 'Jane Smith',
      avatar: '/image/avatar2.jpeg',
      points: 50
    },
    // Add more friends as needed
  ];
  
  showTab(tab: string): void {
    this.activeTab = tab;
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
    if(tab=='challenges'){
        this.callReferred()
    }
  }
  callReferred(){

  }
  ngOnInit() {
    this.userInfo=this.commonService.getUserInfo();
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
