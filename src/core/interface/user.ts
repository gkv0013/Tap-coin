// src/app/models/user-data.interface.ts
export interface UserData {
    id: string;
    username?: string;
    email?: string;
    createdAt: Date;
    lastLogin: Date;
    coinCounter: number;
    nextLevel: number;
    profitPerTap: number;
    profitPerHour: number;
    buttonPressCount: number;
    totalCoins: number;
    friendsInvited: number;
    referralBonus: number;
    dailyLoginStreak: number;
    achievements: string[];
    preferences: {
      notifications: boolean;
    };
  }
  