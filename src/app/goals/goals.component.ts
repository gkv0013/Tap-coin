import { CommonService } from '../common.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // Import ActivatedRoute
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { Goal, postDataInterface } from '../../core/interface/user';
import { DialogService } from '../../core/components/dialog/dialog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
declare var Telegram: any;
import * as FastAverageColor from 'fast-average-color';
import { PostDataService } from '../../core/services/post-data.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

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
  private postDataService = inject(PostDataService);
  bsModalRef?: BsModalRef;
  private telegramServices = inject(TelegramWebappService);
  private dialogService = inject(DialogService);
  @ViewChild('modalyoutube') modalyoutube!: TemplateRef<any>;
  @ViewChild('modalarticle') modalarticle!: TemplateRef<any>;
  @ViewChild('modalsponsors') modalsponsors!: TemplateRef<any>;
  @ViewChild('bannerImage') bannerImageElement!: ElementRef;
  timezone: string = '';
  goalStatus: { isclaimed: boolean; status: string } | null = null;
  public currentGoalNo: string | null = null; // Store the user ID
  public selectedGoalData: any; // Variable to hold a single object
  public selectedYoutubeVideo:any;
  public selectedSponsors:any;
  public selectedArticle:any;
  public articleData:any;
  public goalsData: Goal[] = [];
  public youtubeVideos: any[] = [];
  public sponsorsData: any[] = [];
  userInfo:any;
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
  neonColor: string = 'rgba(0, 0, 0, 0)'; // Transparent color

  ngOnInit(): void {
    this.goalsData=this.commonService.getGoalData() ?? [];
    this.timezone = this.commonService.getTimeZoneOffset();
    this.userInfo=this.commonService.getUserInfo();
    this.currentGoalNo = this.route.snapshot.paramMap.get('id');
    this.selectedGoalData = this.goalsData.find(
      (goal) => goal?.goalno === Number(this.currentGoalNo)
    );
    this.parseYoutubeData();
    this.parseArticleData();
    this.parseSponserData();
    this.enableBackButton();
  }
  ngAfterViewInit(): void {
    const fac = new FastAverageColor.FastAverageColor();
    const imageElement = this.bannerImageElement.nativeElement;

    imageElement.onload = () => {
        const color = fac.getColor(imageElement);
        this.neonColor = color.hex; // Set the neon color based on the dominant color of the image
    };
}
getNeonOutline(color: string): string {
  return `3px solid ${color}`;
}

  enableBackButton() {
    this.telegramServices.backButton.show();
    if (Telegram.WebApp && Telegram.WebApp.BackButton) {
      Telegram.WebApp.BackButton.onClick(() => {
        console.log('Back button clicked');
        this.closeModal(); 
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
    this.selectedYoutubeVideo=this.selectedSponsors=this.selectedArticle=[]
    this.goalStatus = null;
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
  parseSponserData():void{
    if (this.selectedGoalData.sponsor) {
      try {
        this.sponsorsData = JSON.parse(this.selectedGoalData.sponsor);
      } catch (error) {
        console.error('Error parsing sponsor data:', error);
      }
    }
  }
  parseArticleData(): void {
    if (this.selectedGoalData.youtube) {
      try {
        this.articleData = JSON.parse(this.selectedGoalData.article);
      } catch (error) {
        console.error('Error parsing article data:', error);
      }
    }
  }
  async modalYoutube(modalYoutube:any) {
    this.selectedYoutubeVideo=modalYoutube;
    const result = await this.callGoalAchieved(modalYoutube);
    if (result?.Result && result.Result.length > 0) {
      this.goalStatus = result.Result[0];
    }
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
    this.dialogService.openDialog({
      title: '',
      message: '',
      type: '',
      customClass: '',
      customTemplate: this.modalyoutube,
      onConfirm: () => {},
    });
  }
  async modalSponsors(modalSponsors:any) {
    this.selectedSponsors=modalSponsors;
    const result = await this.callGoalAchieved(modalSponsors);
    if (result?.Result && result.Result.length > 0) {
      this.goalStatus = result.Result[0];
    }
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
    this.dialogService.openDialog({
      title: '',
      message: '',
      type: '',
      customClass: '',
      customTemplate: this.modalsponsors,
      onConfirm: () => {},
    });
  }
  async sponsorsMore(){
    if (this.selectedSponsors) {
      await this.saveGoals(this.selectedSponsors);
      window.open(this.selectedSponsors.website, '_blank');
    }
  }

  async claimReward(type: number) {
    let result;
  
    switch (type) {
      case 1:
        result = await this.callGoalAchieved(this.modalSponsors);
        break;
      case 2:
        result = await this.callGoalAchieved(this.modalYoutube);
        break;
      case 3:
        result = await this.callGoalAchieved(this.modalArticle);
        break;
      default:
        console.error('Invalid type for claimReward:', type);
        return;
    }
  
    // Check the result and update goalStatus if applicable
    if (result?.Result && result.Result.length > 0) {
      this.goalStatus = result.Result[0];
    }
  }
  
  async modalArticle(modalArticle:any) {
    this.selectedArticle=modalArticle;
    const result = await this.callGoalAchieved(modalArticle);
    if (result?.Result && result.Result.length > 0) {
      this.goalStatus = result.Result[0];
    }
    this.dialogService.openDialog({
      title: '',
      message: '',
      type: '',
      customClass: '',
      customTemplate: this.modalarticle,
      onConfirm: () => {},
    });
  }
  async watchVideo(): Promise<void> {
    if (this.selectedYoutubeVideo) {
      await this.saveGoals(this.selectedYoutubeVideo);
      window.open(this.selectedYoutubeVideo.video, '_blank');
    }
  }

  saveGoals(data:any): Promise<any> {
    return new Promise((resolve, reject) => {
      const postData: postDataInterface = {
        Mode: 0, // Mode depending on your logic
        CrudType: 0, // Example value
        SaveData: {
          savegoals: [
            {
              mode: 0,
              telegramId: this.userInfo.telegramId,
              goalid: data.id,
              cost: data.coins,
              goaltype: data.typename,
              goaltypeid: data.type,
              time: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { 
                hour12: false 
            }),
            timezone:this.timezone
            },
          ],
        },
      };
      this.postDataService.sendData('Goals', postData).subscribe(
        (response) => {
          if (response.StatusCode === 200 && response.Result) {
            resolve(response);  // Resolve the promise when successful
          } else {
            reject(new Error('Failed to save data.'));
          }
        },
        (error) => {
          console.error('Error saving data:', error);
          reject(error);  // Reject the promise on error
        }
      );
    });
  }
  

  routes(routePath: string): void {
    this.commonService.setActiveTab(routePath);
    this.router.navigate([`/${routePath}`], { queryParams: { source: `/goals/${this.currentGoalNo}`} });
  }  
  async ReadArticle(){
    if (this.selectedArticle) {
      await this.saveGoals(this.selectedArticle);
      window.open(this.selectedArticle.url, '_blank');
    }
  }
  async callGoalAchieved(data: any): Promise<any> {
    const postData: postDataInterface = {
      Mode: 1, // Mode depending on your logic
      CrudType: 1, // Example value
      FetchData: [{
        mode: 1,
        telegramId: this.userInfo.telegramId,
        goalid: data.id,
        goaltype: data.typename,
        goaltypeid: data.type,
        time: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { 
          hour12: false 
        }),
      }],
    };
  
    // Convert the Observable to a Promise and return the result
    return firstValueFrom(this.postDataService.sendData('Goals', postData));
  }
}
