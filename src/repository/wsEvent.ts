export interface WSEvent {
  event: WSSendEvents | WSReceiveEvents;
  data: WSData;
}

export interface WSData {}

export enum WSSendEvents {
  SendContent = 11,
  ReadContent = 12,
  MakePhoneCall = 21,
  MakeChannelMeeting = 31,
}

export enum WSReceiveEvents {
  NewContent = 11,
  BeenReadContent = 12,
  CalledByUser = 21,
  BeenInviteToChannel = 31,
  ChannelMeetingCreated	= 32,
	BeenInviteToMeeting	= 33,
	Error = 90,
  TokenExpired = 91,
}

export interface SendContentToUser extends WSData {
  to: number;
  type: number;
  content: string;
}

export interface ReadUserContent extends WSData {
  user: number;
  contentId: number;
}

export interface NewContent extends WSData {
  from: number;
  to: number;
  type: number;
  content: string;
  time: string;
}

export interface ContentBeenRead extends WSData {
  user: number;
  contentId: number;
}