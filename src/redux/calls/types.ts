export enum CallsActionTypes {
  API_RESPONSE_SUCCESS = "@@calls/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@calls/API_RESPONSE_ERROR",

  GET_CALLS = "@@calls/GET_CALLS",

  WS_EVENT = "@@calls/WS_EVENT",

  GET_CALLER_INFO = "@@calls/GET_CALLER_INFO",
  RESET_CALLING_STATUS = "@@calls/RESET_CALLING_STATUS",
  ON_CALLING = "@@calls/ON_CALLING",
  ANSWERED_CALLING = "@@calls/ANSWERED_CALLING",
  HANGUP_CALLING = "@@calls/HANGUP_CALL",

  /* meeting */
  GET_MEETING_CREATE_BY_SELF = "@@calls/GET_MEETING_CREATE_BY_SELF",
  CHANGE_MEETING_ID = "@@calls/CHANGE_MEETING_ID",

  /* Youtube */
  START_YOUTUBE = "@@calls/START_YOUTUBE",
  YOUTUBE_SYNC = "@@calls/YOUTUBE_SYNC",
  END_YOUTUBE = "@@calls/END_YOUTUBE",
}
export interface CallsState {
  calls: Array<any>;
  onCallingType: string;
  endCalling: boolean;
  hasAnswered: boolean;
  meetingId: number;
}
