import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostDataService } from '../core/services/post-data.service';
import { postDataInterface } from '../core/interface/user';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private userInfo: any;
  private data:any; 
  private activeTabSubject = new BehaviorSubject<string>('collect');
  constructor() { }
  private postDataService = inject(PostDataService);

  setUserInfo(user: any): void {
    this.userInfo = user;
  }
  getUserInfo(): any {
    return this.userInfo;
  }
  setUserData(data:any): void{
     this.data=data;
  }
  getUserData(): any {
    return this.data;
  }

  activeTab$ = this.activeTabSubject.asObservable();

  setActiveTab(tab: string): void {
    this.activeTabSubject.next(tab);
  }

  getActiveTab(): string {
    return this.activeTabSubject.value;
  }
  saveCoins(telegramUser: any) {
    const postData: postDataInterface = {
      Mode: 1, // Mode depending on your logic
      CrudType: 0, // Example value
      SaveData: {'collect':[{
        mode:1,
        id: telegramUser.telegramId,
        profitPerTap: telegramUser.profitPerTap,
        profitPerHour: telegramUser.profitPerHour,
        totalCoins: telegramUser.totalCoins,
      }]},
    };

    this.postDataService.sendData('Login',postData).subscribe(
      (response) => {
        if(response.StatusCode==200){
          console.log('Data saved successfully:', response);
        }
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }
}
