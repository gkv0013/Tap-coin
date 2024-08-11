import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private userInfo: any;
  private data:any; 
  constructor() { }
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
}
