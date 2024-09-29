import { Component, inject } from '@angular/core';
import { postDataInterface } from '../../core/interface/user';
import { PostDataService } from '../../core/services/post-data.service';
import { CommonService } from '../common.service';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent {
  private postDataService = inject(PostDataService);
  public commonService = inject(CommonService);
  private  telegramServices = inject(TelegramWebappService);
  public router = inject(Router);
  userInfo:any;
  logs:any;
  ngOnInit() {
    this.userInfo=this.commonService.getUserInfo(); 
    this.enableBackButton();
    this. getBoostLog()
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
      this.commonService.setActiveTab('airdrop');
      this.router.navigate(['/airdrop']);
      this.hideBackButton();
    }
    hideBackButton() {
      this.telegramServices.backButton.hide();  
    }
  getBoostLog(){
    const postData: postDataInterface = {
      Mode:1, // Mode depending on your logic
      CrudType: 1, // Example value
      FetchData:[{
        mode:0,
        telegramId: this.userInfo.telegramId,
      }],
    };
    this.postDataService.sendData('Boost',postData).subscribe(
      (response) => {
        if(response.StatusCode==200){
         if(response?.Result?.length>0){
          this.logs=response?.Result;
         }
        }
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }
}
