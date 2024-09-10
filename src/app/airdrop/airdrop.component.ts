import { Component, inject } from '@angular/core';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { postDataInterface } from '../../core/interface/user';
import { CommonService } from '../common.service';
import { PostDataService } from '../../core/services/post-data.service';
import { CollectService } from '../../core/services/collect.service';
import { trigger, style, animate, transition} from '@angular/animations';
@Component({
  selector: 'app-airdrop',
  standalone: true,
  imports: [],
  templateUrl: './airdrop.component.html',
  styleUrl: './airdrop.component.css',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }), // Start with opacity 0 and slide up from below
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // Animate to visible state and original position
      ])
    ]),      trigger('buttonAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }), // Initial state (scaled down, invisible)
        animate('0.5s ease-out', style({ transform: 'scale(1)', opacity: 1 })) // Final state (scaled up, visible)
      ])
    ])
  ]
})
export class AirdropComponent {
  public commonService = inject(CommonService);
  private readonly telegramServices = inject(TelegramWebappService);
  private postDataService = inject(PostDataService);
  private readonly collectService = inject(CollectService);
  userInfo:any;
  walletBalance:number=0;
  ngOnInit() {
    this.userInfo=this.commonService.getUserInfo();
    this.getCoins(); 
    }
  connectToWallet(){
    this.telegramServices.hapticFeedback.impactOccurred('medium');
      this.telegramServices
        .showPopup({ message: 'Comming Soon' })
        .subscribe((airdrop) => {
          console.log(airdrop);
        });
    }
    getCoins() {
      const postData: postDataInterface = {
        Mode:0, // Mode depending on your logic
        CrudType: 1, // Example value
        FetchData:[{
          mode:0,
          id: this.userInfo.telegramId,
        }],
      };
  
      this.postDataService.sendData('Wallet',postData).subscribe(
        (response) => {
          if(response.StatusCode==200){
           if(response?.Result?.length>0){
            let claim:number=response?.Result?.[0]?.totalcoins;
            if(claim){
              this.collectService.addButtonPressCount(claim);
              this.walletBalance=claim;
            }
           }
          }
        },
        (error) => {
          console.error('Error saving data:', error);
        }
      );
    }
}
