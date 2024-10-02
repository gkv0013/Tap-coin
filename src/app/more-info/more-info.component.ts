import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { CommonService } from '../common.service';
declare var Telegram: any;
@Component({
  selector: 'app-more-info',
  standalone: true,
  imports: [],
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.css'
})
export class MoreInfoComponent {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  public commonService = inject(CommonService);
  private  telegramServices = inject(TelegramWebappService);
  public safeUrl: SafeResourceUrl | null = null;
  public goalId: number | undefined;
  ngOnInit(): void {
    const moreInfoUrl = this.route.snapshot.queryParamMap.get('url');
    const id=this.route.snapshot.queryParamMap.get('id');
    if(id){
      this.goalId =parseInt(id);
    }
    if (moreInfoUrl) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(moreInfoUrl);
    }
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
    this.router.navigate([`/goals:`, this.goalId]);  // Assuming goalId is stored
    this.commonService.setActiveTab('green');
  }
  
}
