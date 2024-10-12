import { Component, inject } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NgIf } from '@angular/common';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  imports: [ NgIf],
  styleUrls: ['./tasks.component.css'],
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
      trigger('buttonAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }), // Initial state (scaled down, invisible)
        animate('0.5s ease-out', style({ transform: 'scale(1)', opacity: 1 })) // Final state (scaled up, visible)
      ])
    ])
  ]
})
export class TasksComponent {
  activeTab: string = 'tasks'; // Set default active tab
  isCardAnimationDone = false
  private readonly telegramServices = inject(TelegramWebappService);
  ngAfterViewInit() {
   
  }

  onCardAnimationDone() {
    // This method is triggered after the card animation is complete
    this.isCardAnimationDone = true;
  }

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
  subscribeYoutube(){
    this.telegramServices.hapticFeedback.impactOccurred('medium');
    const telegramShareUrl = `https://www.youtube.com/@waveplusglobal`;
    window.open(telegramShareUrl, '_blank');
  }
  shareOnTelegram() {
    // const urlToShare = encodeURIComponent('https://yourapp.com/referral?user=123'); // Replace with your actual URL
    // const textToShare = encodeURIComponent('Join our app and earn rewards!'); // Optional text

    // const telegramShareUrl = `https://t.me/share/url?url=${urlToShare}&text=${textToShare}`;
    // window.open(telegramShareUrl, '_blank');
    this.telegramServices.hapticFeedback.impactOccurred('medium');
    this.telegramServices
      .showPopup({ message: 'Comming Soon' })
      .subscribe((airdrop) => {
        console.log(airdrop);
      });
  }
}
