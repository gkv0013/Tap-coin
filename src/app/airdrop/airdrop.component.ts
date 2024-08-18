import { Component, inject } from '@angular/core';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';

@Component({
  selector: 'app-airdrop',
  standalone: true,
  imports: [],
  templateUrl: './airdrop.component.html',
  styleUrl: './airdrop.component.css'
})
export class AirdropComponent {
  private readonly telegramServices = inject(TelegramWebappService);
  connectToWallet(){
      this.telegramServices
        .showPopup({ message: 'Comming Soon' })
        .subscribe((airdrop) => {
          console.log(airdrop);
        });
    }
}
