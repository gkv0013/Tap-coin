import { CommonService } from '../common.service';
import { CollectService } from '../../core/services/collect.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // Import ActivatedRoute
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { Goal } from '../../core/interface/user';
import { DialogService } from '../../core/components/dialog/dialog.service';
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
  private route = inject(ActivatedRoute);
  private telegramServices = inject(TelegramWebappService);
  private dialogService = inject(DialogService);
  @ViewChild('modalyoutube') modalyoutube!: TemplateRef<any>;
  public currentGoalNo: string | null = null; // Store the user ID
  public selectedGoalData: any; // Variable to hold a single object
  public selectedYoutubeVideo:any;
  public goalsData: Goal[] = [];
  public youtubeVideos: any[] = [];
  isOverviewSelected: boolean = true;
  activeTab: string = 'overview';
  selectTab(tab: string) {
    this.activeTab=tab;
    if (tab === 'overview') {
      this.isOverviewSelected = true;
    } else {
      this.isOverviewSelected = false;
    }
  }

  ngOnInit(): void {
    this.goalsData=this.commonService.getGoalData() ?? [];
    this.currentGoalNo = this.route.snapshot.paramMap.get('id');
    this.selectedGoalData = this.goalsData.find(
      (goal) => goal?.goalno === Number(this.currentGoalNo)
    );
    this.parseYoutubeData();
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
  closeModal() {
    this.dialogService.closeDialog();
    this.selectedYoutubeVideo=[]
  }
  parseYoutubeData(): void {
    if (this.selectedGoalData.youtube) {
      try {
        this.youtubeVideos = JSON.parse(this.selectedGoalData.youtube);
      } catch (error) {
        console.error('Error parsing youtube data:', error);
      }
    }
  }
  modalYoutube(modalYoutube:any) {
    this.selectedYoutubeVideo=modalYoutube;
    this.dialogService.openDialog({
      title: '',
      message: '',
      type: '',
      customClass: '',
      customTemplate: this.modalyoutube,
      onConfirm: () => {},
    });
  }
}
