import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonService } from '../common.service';
import { BoostDataFetch } from '../../core/services/boost.service';
import { PostDataService } from '../../core/services/post-data.service';
import {
  Boost,
  BoosterData,
  postDataInterface,
} from '../../core/interface/user';
import { CollectService } from '../../core/services/collect.service';
import { DialogService } from '../../core/components/dialog/dialog.service';
import { Subscription } from 'rxjs';
import confetti from 'canvas-confetti';
@Component({
  selector: 'app-boost',
  standalone: true,
  imports: [],
  templateUrl: './boost.component.html',
  styleUrl: './boost.component.css',
})
export class BoostComponent {
  userInfo: any;
  @ViewChild('modalfullenergy') modalfullenergy!: TemplateRef<any>;
  @ViewChild('modalmultitap') modalmultitap!: TemplateRef<any>;
  @ViewChild('modalenergyboost') modalenergyboost!: TemplateRef<any>;
  walletBalance: number = 0;
  coins: any;
  public commonService = inject(CommonService);
  private dialogService = inject(DialogService);
  private readonly collectService = inject(CollectService);
  private postDataService = inject(PostDataService);
  private subscriptions: Subscription[] = [];
  constructor() {}
  ngOnInit() {
    this.userInfo = this.commonService.getUserInfo();
    this.coins = this.collectService.getCoinsetting();
    this.subscriptions.push(
      this.collectService
        .getButtonPressCount()
        .subscribe((count) => (this.walletBalance = count))
    );
  }
  closeModal() {
    this.dialogService.closeDialog();
  }
  fullEnergy() {
    this.dialogService.openDialog({
      title: '',
      message: '',
      type: '',
      customClass: '',
      customTemplate: this.modalfullenergy,
      onConfirm: () => {},
    });
  }
  getLevel(): number {
    const currentCoinTier = this.coins.find(
      (coin: any) => this.walletBalance >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.level : 0;
  }
  getfillenergycount(): number {
    const currentCoinTier = this.coins.find(
      (coin: any) => this.walletBalance >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.fullenergy : 0;
  }
  getEnergyBoostCost(): number {
    const currentCoinTier = this.coins.find(
      (coin: any) => this.walletBalance >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.energyboostcost : 0;
  }
  getEnergyBoost(): number {
    const currentCoinTier = this.coins.find(
      (coin: any) => this.walletBalance >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.energyboost : 0;
  }

  getMultiTapCost(): number {
    const currentCoinTier = this.coins.find(
      (coin: any) => this.walletBalance >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.multitapcost : 0;
  }
  getmultitap(): number {
    const currentCoinTier = this.coins.find(
      (coin: any) => this.walletBalance >= coin.progress
    );
    return currentCoinTier ? currentCoinTier.multitap : 1;
  }
  energyBoost() {
    this.dialogService.openDialog({
      title: '',
      message: '',
      type: '',
      customClass: '',
      customTemplate: this.modalenergyboost,
      onConfirm: () => {},
    });
  }
  multiTap() {
    this.dialogService.openDialog({
      title: '',
      message: '',
      type: '',
      customClass: '',
      customTemplate: this.modalmultitap,
      onConfirm: () => {},
    });
  }
  activateFullenergy() {
    try {
      const postData: postDataInterface = {
        Mode: 0,
        CrudType: 0,
        SaveData: {
          activatefullenergy: [
            {
              mode: 0,
              telegramId: this.userInfo.telegramId,
              cost: 0,
              boosttype: 'Energy Fill',
              boosttypeid: 1,
              time: new Date().toISOString().toString(),
            },
          ],
        },
      };

      this.postDataService.sendData('Boost', postData).subscribe(
        (response) => {
          if (response.StatusCode == 200) {
            this.closeModal();
            this.triggerConfetti();
            if (response?.Result?.length > 0) {
              let fillenergy: number = response?.Result?.[0]?.fillenergy;
              if (fillenergy) {
                const userData = this.commonService.getUserInfo();
                userData.fillenergy = fillenergy;
                this.commonService.setUserInfo(userData);
                this.collectService.resetCurrentEnergy();
              }
            }
          } else {
            this.closeModal();
          }
        },
        (error) => {
          console.error('Error saving data:', error);
          this.closeModal();
        }
      );
    } catch (error) {
      console.log('activateFullenergy:', error);
      this.closeModal();
    }
  }

  activateMultiTap() {
    try {
      const postData: postDataInterface = {
        Mode: 1,
        CrudType: 0,
        SaveData: {
          activatemultitap: [
            {
              mode: 1,
              telegramId: this.userInfo.telegramId,
              cost: this.getMultiTapCost(),
              boosttype: 'Multi Tap',
              boosttypeid: 2,
              time: new Date().toISOString().toString(),
            },
          ],
        },
      };

      this.postDataService.sendData('Boost', postData).subscribe(
        (response) => {
          if (response.StatusCode == 200) {
            this.closeModal();
            this.triggerConfetti();
            if (response?.Result?.length > 0) {
              let claim: number = response?.Result?.[0]?.totalCoins;
              if (claim >= 0) {
                this.collectService.addButtonPressCount(claim);
              }
              let ismultitap = response?.Result?.[0]?.ismultitap;
              if (ismultitap) {
                const userData = this.commonService.getUserInfo();
                userData.ismultitap = ismultitap;
                this.commonService.setUserInfo(userData);
                let multitap: number = this.getmultitap() ?? 1;
                if (multitap > 0) {
                  this.collectService.setProfitPerTap(multitap);
                }
              }
            }
          } else {
            this.closeModal();
          }
        },
        (error) => {
          console.error('Error saving data:', error);
          this.closeModal();
        }
      );
    } catch (error) {
      console.log('activateFullenergy:', error);
      this.closeModal();
    }
  }

  activateEnergyBoost() {
    try {
      const postData: postDataInterface = {
        Mode: 2,
        CrudType: 0,
        SaveData: {
          activateenergyboost: [
            {
              mode: 2,
              telegramId: this.userInfo.telegramId,
              cost: this.getEnergyBoostCost(),
              boosttype: 'Energy Boost',
              boosttypeid: 3,
              time: new Date().toISOString().toString(),
            },
          ],
        },
      };

      this.postDataService.sendData('Boost', postData).subscribe(
        (response) => {
          if (response.StatusCode == 200) {
            this.closeModal();
            this.triggerConfetti();
            if (response?.Result?.length > 0) {
              let claim: number = response?.Result?.[0]?.totalCoins;
              if (claim >= 0) {
                this.collectService.addButtonPressCount(claim);
              }
              let isenergyboost = response?.Result?.[0]?.isenergyboost;
              if (isenergyboost) {
                const userData = this.commonService.getUserInfo();
                userData.isenergyboost = isenergyboost;
                this.commonService.setUserInfo(userData);
                let energyBoost: number = this.getEnergyBoost() ?? 1;
                if (energyBoost > 0) {
                  this.collectService.setEnergyIncrement(energyBoost);
                }
              }
            }
          } else {
            this.closeModal();
          }
        },
        (error) => {
          console.error('Error saving data:', error);
          this.closeModal();
        }
      );
    } catch (error) {
      console.log('activateEnergyBoost:', error);
      this.closeModal();
    }
  }

  triggerConfetti() {
    // Basic confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }, // Controls the starting point
    });
  }
}
