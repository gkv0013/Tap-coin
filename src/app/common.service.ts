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
  private goalsdata: any;
  private activeTabSubject = new BehaviorSubject<string>('collect');
  private isWelcomeSubject = new BehaviorSubject<boolean>(false); // default value is `true`
  isWelcome$ = this.isWelcomeSubject.asObservable();
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
  setGoalData(goalsdata: any): void {
    this.goalsdata = goalsdata;
  }
  getGoalData(): any {
    return this.goalsdata;
  }
  activeTab$ = this.activeTabSubject.asObservable();

  setActiveTab(tab: string): void {
    this.activeTabSubject.next(tab);
  }

  getActiveTab(): string {
    return this.activeTabSubject.value;
  }
  setIsWelcome(value: boolean) {
    this.isWelcomeSubject.next(value);
  }
}
