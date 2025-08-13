export interface IClub {
  id: number;
  clubName: string;
  clubLogo: string;
  clubTheme1: string;
  clubTheme2: string;
}

export interface IAthlete {
  id: number;
  athleteName: string;
  athleteBirthDate: string;
  speedRun: number;
  secondSpeedRun: number;
  agilityRun: number;
  jumping: number;
  flexibility: number;
  height: number;
  weight: number;
  bmi?: number;
  bmiStatus?: string;
  percentile?: number;
  fatigueIndex?: number;
  performanceDetails?: {
    speedRun: number;
    secondSpeedRun: number;
    agilityRun: number;
    flexibility: number;
    jumping: number;
  };
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
