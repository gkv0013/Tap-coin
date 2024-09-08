import { Component, inject } from '@angular/core';
import { CommonService } from '../common.service';
import { BoostDataFetch } from '../../core/services/boost.service';
import { Boost, postDataInterface } from '../../core/interface/user';
@Component({
  selector: 'app-boost',
  standalone: true,
  imports: [],
  templateUrl: './boost.component.html',
  styleUrl: './boost.component.css'
})
export class BoostComponent {
  userInfo:any;
  public commonService = inject(CommonService);
  private boostDataFetch = inject(BoostDataFetch);
  pendingCount:number=0;
  limit:number=0;
  totalUsed:number=0;
  totalDay: number = 0;
  dayDifference: number = 0;
  progress: number = 0;
  
  constructor() { 
    this.userInfo=this.commonService.getUserInfo();
 
    this.featchBoost();
    console.log(this.dayDifference);
    
    this.updateProgress();
  }

  featchBoost():void{
    const postData: Boost = {
          mode:0,
          telegramId: this.userInfo.telegramId
      };
      this.boostDataFetch.sendData('Boost',postData).subscribe(
        (response) => {
          if(response.StatusCode==200){
            if(response.Result){
              console.log(response.Result);
              this.pendingCount = response.Result[0].pendingCount;
              this.limit = response.Result[0].limit;
              this.totalUsed = response.Result[0].totalUsed;
              this.totalDay=response.Result[0].totalDay;
              const lastReset = new Date(response.Result[0].lastReset);
              const currentDate = new Date();

              const timeDifference = currentDate.getTime() - lastReset.getTime();
              this.dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
              console.log(this.dayDifference);
              if (this.dayDifference>=1)
                {
                  
                  this.dayReset();
                  this.featchBoost();
                }
              this.updateProgress();
            }
          }
        },
        (error) => {
          console.error('Error saving data:', error);
        }
      );
      
  }



  claimBoost():void {
    const postData: Boost = {
      mode:1,
      telegramId: this.userInfo.telegramId
  };
  this.boostDataFetch.sendData('Boost',postData).subscribe(
    (response) => {
      if(response.StatusCode==200){
        if(response.Result){
          console.log(response.Result);
          this.featchBoost();
        }
      }
    },
    (error) => {
      console.error('Error saving data:', error);
    }
  );
  
  }


  dayReset():void {
    const postData: Boost = {
      mode:2,
      telegramId: this.userInfo.telegramId
  };
  this.boostDataFetch.sendData('Boost',postData).subscribe(
    (response) => {
      if(response.StatusCode==200){
        if(response.Result){
          console.log(response.Result);
          this.featchBoost();
        }
      }
    },
    (error) => {
      console.error('Error saving data:', error);
    }
  );
  
  }

    // Function to update the progress value
    updateProgress(): void {
      if (this.pendingCount==0)
      {
        this.progress = 0;
      }
      this.progress = Math.max(0, Math.min(100,  (100/ this.limit)*this.pendingCount  ));
    }

}

