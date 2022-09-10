export enum CallsActionTypes {
  API_RESPONSE_SUCCESS = "@@calls/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@calls/API_RESPONSE_ERROR",

  GET_CALLS = "@@calls/GET_CALLS",

  WS_EVENT = "@@calls/WS_EVENT",

  GET_CALLER_INFO = "@@calls/GET_CALLER_INFO",
  RESET_CALLING_STATUS = "@@calls/RESET_CALLING_STATUS",
  ON_CALLING = "@@calls/ON_CALLING",
  HANGUP_CALLING = "@@calls/HANGUP_CALL",
}
export interface CallsState {
  calls: Array<any>;
  onCalling: boolean;
  endCalling: boolean;
}
