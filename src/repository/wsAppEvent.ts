import { AppData } from "./wsEvent";

export enum WSApp {
  youtube = 1,
}

/*    Youtube    */
export enum YTEvent {
  sync = 1,
  update,
}

export interface YoutubeSync extends AppData {
  state: number;
  videoID: string;
  rate: string;
  currentTime: number;
}