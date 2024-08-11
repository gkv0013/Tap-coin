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


  shareOnTelegram() {
    const urlToShare = encodeURIComponent('https://yourapp.com/referral?user=123'); // Replace with your actual URL
    const textToShare = encodeURIComponent('Join our app and earn rewards!'); // Optional text

    const telegramShareUrl = `https://t.me/share/url?url=${urlToShare}&text=${textToShare}`;
    window.open(telegramShareUrl, '_blank');
  }
}
