// src/app/models/user-data.interface.ts
export interface UserData {
    id: string;
    username?: string;
    firstname:string;
    lastname:string;
    createdAt: Date;
    lastLogin: Date;
    profitPerTap: number;
    profitPerHour: number;
    buttonPressCount: number;
    totalCoins: number;
    friendsInvited: number;
    referralBonus: number;
    dailyLoginStreak: number;
    coinCounter:number;
    nextLevel:number;
    achievements:string[];
  }
  
  export interface postDataInterface {
    Mode: number;
    CrudType?: number;
    FetchData?: Array<any>;
    SaveData?: {};
    ApplicationType?: number;//Used  for  type eg: mobile,dekstop,laptop,tab
    SaveDataObject?: {}
    TargetElement?: string;  
    ComponentName?: string;
}
export interface Friend {
  referid:number;
  name: string;
  avatar: string;
  claimed: boolean; // Add the claimed property
}

export interface Boost {
  mode:number;
  telegramId: string;
  boostType: string;
}

export interface BoosterData {
  boostCost:number;
  totalUsed: number;
  boostEffect:number;
  boostType: string;
  active: number;
  balance: number;
}
export interface Goal {
  goalno: number;
  title: string;
  description: string;
  imagepath: string;
  moreInfo: string;
  isdisabled?: number;
  youtube?: any;
  sponsor?: any;
  article?: any;
  bannerimagepath:string;
}
