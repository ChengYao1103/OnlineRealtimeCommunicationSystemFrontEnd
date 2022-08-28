export enum CallsActionTypes {
  API_RESPONSE_SUCCESS = "@@calls/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@calls/API_RESPONSE_ERROR",

  GET_CALLS = "@@calls/GET_CALLS",

  WS_EVENT = "@@calls/WS_EVENT",

  ON_CALLING = "@@calls/ON_CALLING",
  HANGUP_CALL = "@@calls/HANGUP_CALL",
}
export interface CallsState {
  calls: Array<any>;
  onCalling: boolean;
}
