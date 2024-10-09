import { CommonService } from '../common.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // Import ActivatedRoute
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { Goal } from '../../core/interface/user';
import { DialogService } from '../../core/components/dialog/dialog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
declare var Telegram: any;
import * as FastAverageColor from 'fast-average-color';

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
  bsModalRef?: BsModalRef;
  private telegramServices = inject(TelegramWebappService);
  private dialogService = inject(DialogService);
  @ViewChild('modalyoutube') modalyoutube!: TemplateRef<any>;
  @ViewChild('modalarticle') modalarticle!: TemplateRef<any>;
  @ViewChild('modalsponsors') modalsponsors!: TemplateRef<any>;
  @ViewChild('bannerImage') bannerImageElement!: ElementRef;
  public currentGoalNo: string | null = null; // Store the user ID
  public selectedGoalData: any; // Variable to hold a single object
  public selectedYoutubeVideo:any;
  public selectedSponsors:any;
  public selectedArticle:any;
  public articleData:any;
  public goalsData: Goal[] = [];
  public youtubeVideos: any[] = [];
  public sponsorsData: any[] = [];
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
  modalYoutube(modalYoutube:any) {
    this.selectedYoutubeVideo=modalYoutube;
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
  modalSponsors(modalSponsors:any) {
    this.selectedSponsors=modalSponsors;
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
  sponsorsMore(){
    if (this.selectedSponsors) {
      window.open(this.selectedSponsors.website, '_blank');
    }
  }
  modalArticle(modalArticle:any) {
    this.selectedArticle=modalArticle;
    this.dialogService.openDialog({
      title: '',
      message: '',
      type: '',
      customClass: '',
      customTemplate: this.modalarticle,
      onConfirm: () => {},
    });
  }
  watchVideo(): void {
    if (this.selectedYoutubeVideo) {
      window.open(this.selectedYoutubeVideo.video, '_blank');
    }
  }
  routes(routePath: string): void {
    this.commonService.setActiveTab(routePath);
    this.router.navigate([`/${routePath}`], { queryParams: { source: `/goals/${this.currentGoalNo}`} });
  }  
  ReadArticle(){
    if (this.selectedArticle) {
      window.open(this.selectedArticle.url, '_blank');
    }
  }
}
