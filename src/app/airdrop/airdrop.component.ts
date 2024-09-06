import { Component, inject } from '@angular/core';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { postDataInterface } from '../../core/interface/user';
import { CommonService } from '../common.service';
import { PostDataService } from '../../core/services/post-data.service';
import { CollectService } from '../../core/services/collect.service';

@Component({
  selector: 'app-airdrop',
  standalone: true,
  imports: [],
  templateUrl: './airdrop.component.html',
  styleUrl: './airdrop.component.css'
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
