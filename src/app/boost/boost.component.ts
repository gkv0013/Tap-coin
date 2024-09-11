import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { CommonService } from '../common.service';
import { BoostDataFetch } from '../../core/services/boost.service';
import { PostDataService } from '../../core/services/post-data.service';
import { Boost, BoosterData,postDataInterface } from '../../core/interface/user';
import { CollectService } from '../../core/services/collect.service';
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
  private readonly collectService = inject(CollectService);
  private postDataService = inject(PostDataService);
  pendingCount:number=0;
  limit:number=0;
  totalUsed:number=0;
  totalDay: number = 0;
  dayDifference: number = 0;
  progress: number = 0;
  tapBooster: BoosterData ={    boostCost:0,totalUsed: 0,boostEffect:0,boostType: '',active: 0,balance:0} ;
  energyBooster: BoosterData ={    boostCost:0,totalUsed: 0,boostEffect:0,boostType: '',active: 0,balance:0} ;
  

  
  
  constructor() { 
    this.userInfo=this.commonService.getUserInfo();
 
    this.fetchDailyBoost();
    this.fetchTapBoost();
    this.fetchEnergyBoost();
    
    this.updateProgress();
  }

  //fetch Daily boost data
  fetchDailyBoost():void{
    const postData: Boost = {
          mode:0,
          telegramId: this.userInfo.telegramId,
          boostType: "dailyBoost"
      };
      this.boostDataFetch.sendData('Boost',postData).subscribe(
        (response) => {
          if(response.StatusCode==200){
            if(response.Result){
              this.pendingCount = response.Result[0].pendingCount;
              this.limit = response.Result[0].limit;
              this.totalUsed = response.Result[0].totalUsed;
              this.totalDay=response.Result[0].totalDay;
              const lastReset = new Date(response.Result[0].lastReset);
              const currentDate = new Date();

              const timeDifference = currentDate.getTime() - lastReset.getTime();
              this.dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
              if (this.dayDifference>=1)
                {
                  
                  this.dayReset();
                  this.fetchDailyBoost();
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

    //fetch mutitap
    fetchTapBoost():void{
      const postData: Boost = {
            mode:0,
            telegramId: this.userInfo.telegramId,
            boostType: "coinMutipler"
        };
        this.boostDataFetch.sendData('Boost',postData).subscribe(
          (response) => {
            if(response.StatusCode==200){
              if(response.Result){
                this.tapBooster.boostCost=response.Result[0].boostCost;
                this.tapBooster.totalUsed=response.Result[0].totalUsed;
                this.tapBooster.boostEffect=response.Result[0].boostEffect;
                this.tapBooster.boostType=response.Result[0].boostType;
                this.tapBooster.active=response.Result[0].active;
                this.tapBooster.balance=response.Result[0].balance;
                this.collectService.setprofitPerTap(response.Result[0].boostEffectCurrent);
              }
            }
          },
          (error) => {
            console.error('Error saving data:', error);
          }
        );
    }

    fetchEnergyBoost():void{
      const postData: Boost = {
            mode:0,
            telegramId: this.userInfo.telegramId,
            boostType: "energyMutiplier"
        };
        this.boostDataFetch.sendData('Boost',postData).subscribe(
          (response) => {
            if(response.StatusCode==200){
              if(response.Result){
                this.energyBooster.boostCost=response.Result[0].boostCost;
                this.energyBooster.totalUsed=response.Result[0].totalUsed;
                this.energyBooster.boostEffect=response.Result[0].boostEffect;
                this.energyBooster.boostType=response.Result[0].boostType;
                this.energyBooster.active=response.Result[0].active;
                this.energyBooster.balance=response.Result[0].balance;
                this.collectService.setEnergyIncrement(response.Result[0].boostEffectCurrent);
              }
            }
          },
          (error) => {
            console.error('Error saving data:', error);
          }
        );
        
    }


  //boost claim button
  claimBoost(type:string):void {
    if (type=='dailyBoost'){
      if (this.pendingCount!=0)
        {
            const postData: Boost = {
              mode:1,
              telegramId: this.userInfo.telegramId,
              boostType: "dailyBoost"
          };
          this.boostDataFetch.sendData('Boost',postData).subscribe(
            (response) => {
              if(response.StatusCode==200){
                if(response.Result){
                  this.collectService.resetCurrentEnergy();
                  this.fetchDailyBoost();
                }
              }
            },
            (error) => {
              console.error('Error saving data:', error);
            }
          );  
        } 
    }
    if (type=='coinMutipler'){

      const postData: Boost = {
        mode:1,
        telegramId: this.userInfo.telegramId,
        boostType: "coinMutipler"
        };
        this.boostDataFetch.sendData('Boost',postData).subscribe(
            (response) => {
              if(response.StatusCode==200){
                if(response.Result){
                  if (this.tapBooster.balance > this.tapBooster.boostCost)
                  {
                    this.saveCoins(this.tapBooster.boostCost*-1);
                  }
                  
                  this.fetchTapBoost();
                }
              }
            },
            (error) => {
              console.error('Error saving data:', error);
            }
        );  
      
    }
    if (type=='energyMutiplier'){

      const postData: Boost = {
            mode:1,
            telegramId: this.userInfo.telegramId,
            boostType: "energyMutiplier"
        };
      this.boostDataFetch.sendData('Boost',postData).subscribe(
        (response) => {
          if(response.StatusCode==200){
            if(response.Result){

              if (this.energyBooster.balance > this.energyBooster.boostCost)
                {
                  this.saveCoins(this.energyBooster.boostCost*-1);
                }
              this.fetchEnergyBoost();
            }
          }
        },
        (error) => {
          console.error('Error saving data:', error);
        }
      );  


    }
    
   
  }

    //daily reset function
    dayReset():void {
      const postData: Boost = {
        mode:2,
        telegramId: this.userInfo.telegramId,
        boostType: "dailyBoost"
    };
    this.boostDataFetch.sendData('Boost',postData).subscribe(
      (response) => {
        if(response.StatusCode==200){
          if(response.Result){
            this.fetchDailyBoost();
          }
        }
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
    
    }

    saveCoins(claim:number) {
      const postData: postDataInterface = {
        Mode: 1, // Mode depending on your logic
        CrudType: 0, // Example value
        SaveData: {'collect':[{
          mode:1,
          id: this.userInfo.telegramId,
          claim: claim,
        }]},
      };
  
      this.postDataService.sendData('Login',postData).subscribe(
        (response) => {
          if(response.StatusCode==200){
           if(response?.Result?.length>0){
            let claim:number=response?.Result?.[0]?.totalCoins;
            if(claim){
              this.collectService.addButtonPressCount(claim);
            }
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

