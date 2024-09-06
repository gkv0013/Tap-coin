import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { CommonService } from '../common.service';
import { Friend, postDataInterface } from '../../core/interface/user';
import { PostDataService } from '../../core/services/post-data.service';
import { AvatarModule } from '@boringer-avatars/angular';
import { CollectService } from '../../core/services/collect.service';
@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule,AvatarModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent {
  userInfo:any;
  constructor() {}
  public commonService = inject(CommonService);
  private postDataService = inject(PostDataService);
  activeTab: string = 'tasks'; // Set default active tab
  friendsList:Friend[]= [];
  
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
            this.friendsList=response.Result;
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
