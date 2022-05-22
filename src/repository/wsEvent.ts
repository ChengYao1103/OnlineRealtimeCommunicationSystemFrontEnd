export interface WSEvent {
  event: WSSendEvents | WSReceiveEvents;
  data: WSData;
}

export interface WSData {}

export enum WSSendEvents {
  SendContent = 11,
  ReadMessage = 12,
  MakePhoneCall = 21,
  MakeChannelMeeting = 31,
}

export enum WSReceiveEvents {
  NewMessage = 11,
  BeenReadMessage = 12,
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

export interface NewContentFromUser extends WSData {
  from: number;
  type: number;
  content: string;
}

export interface ContentBeenRead extends WSData {
  user: number;
  contentId: number;
}