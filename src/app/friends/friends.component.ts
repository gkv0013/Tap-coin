import { Component } from '@angular/core';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent {
  constructor(private telegramWebappService: TelegramWebappService) {}
  activeTab: string = 'tasks'; // Set default active tab

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
  }

  shareOnTelegram() {
    const urlToShare = encodeURIComponent('https://yourapp.com/referral?user=123'); // Replace with your actual URL
    const textToShare = encodeURIComponent('Join our app and earn rewards!'); // Optional text

    const telegramShareUrl = `https://t.me/share/url?url=${urlToShare}&text=${textToShare}`;
    window.open(telegramShareUrl, '_blank');
  }
}
