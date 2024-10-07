import { CommonService } from '../common.service';
import { CollectService } from '../../core/services/collect.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // Import ActivatedRoute
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { Goal } from '../../core/interface/user';
declare var Telegram: any;
@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
})
export class GoalComponent implements OnInit {
  public commonService = inject(CommonService);
  public router = inject(Router);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute
  private telegramServices = inject(TelegramWebappService);
  public currentGoalNo: string | null = null; // Store the user ID
  public goalData: any; // Variable to hold a single object
  public goalsData: Goal[] = [];
  isOverviewSelected: boolean = true;

  selectTab(tab: string) {
    if (tab === 'overview') {
      this.isOverviewSelected = true;
    } else {
      this.isOverviewSelected = false;
    }
  }

  ngOnInit(): void {
    this.goalsData=this.commonService.getGoalData() ?? [];
    this.currentGoalNo = this.route.snapshot.paramMap.get('id');
    this.goalData = this.goalsData.find(
      (goal) => goal?.goalno === Number(this.currentGoalNo)
    );
    this.enableBackButton();
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
    this.router.navigate(['/green']);
    this.commonService.setActiveTab('green');
    this.hideBackButton();
  }
  hideBackButton() {
    this.telegramServices.backButton.hide();
  }
  showMoreInfo(goalData: any) {
    const moreInfoObject = JSON.parse(goalData.moreinfo);
    const url = moreInfoObject.url;
    this.router.navigate(['/more-info'], {
      queryParams: { id: goalData.goalNo, url: url },
    });
  }
}
