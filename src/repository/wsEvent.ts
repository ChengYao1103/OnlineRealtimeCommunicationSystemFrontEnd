export interface WSEvent {
  event: WSSendEvents | WSReceiveEvents;
  data: WSData;
}

export interface WSData {}

export enum WSSendEvents {
  SendContent = 11,
  ReadContent = 12,
  MakePhoneCall = 21,
  ResponsePhoneCall = 22,
  SendSignalingInformation = 23,
  EndPhoneCall = 24,
  MakeChannelMeeting = 31,
}

export enum WSReceiveEvents {
  NewContent = 11,
  ContentBeenRead = 12,
  AskPhoneCall = 21,
  AnswerPhoneCall = 22,
  GetSignalingInformation = 23,
  HangUpPhoneCall = 24,
  BeenInviteToChannel = 31,
  ChannelMeetingCreated = 32,
  BeenInviteToMeeting = 33,
  Error = 90,
  TokenExpired = 91,
}

//
// send
//
export interface SendContentToUser extends WSData {
  to: number;
  type: number;
  content: string;
}

export interface ReadUserContent extends WSData {
  user: number;
  contentId: number;
}

export interface MakePhoneCall extends WSData {
  to: number;
}

export interface ResponsePhoneCall extends WSData {
  from: number;
  accept: boolean;
}

export interface SendSignalingInformation extends WSData {
  to: number;
  info: string;
  type: string;
}

export interface EndPhoneCall extends WSData {
  to: number;
}

export interface UpdateToken extends WSData {
  newToken: string;
}

//
// receive
//
export interface NewContent extends WSData {
  from: number;
  to: number;
  type: number;
  content: string;
  id: number;
  time: string;
}

export interface ContentBeenRead extends WSData {
  user: number;
  contentId: number;
}

export interface AskPhoneCall extends WSData {
  from: number;
}

export interface AnswerPhoneCall extends WSData {
  from: number;
  accept: boolean;
}

export interface GetSignalingInformation extends WSData {
  from: number;
  info: any;
  type: string;
}

export interface HangUpPhoneCall extends WSData {
  from: number;
}
