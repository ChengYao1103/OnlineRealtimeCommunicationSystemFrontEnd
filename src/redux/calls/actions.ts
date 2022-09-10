import { CallsActionTypes } from "./types";

// common success
export const callsApiResponseSuccess = (actionType: string, data: any) => ({
  type: CallsActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const callsApiResponseError = (actionType: string, error: string) => ({
  type: CallsActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCalls = () => ({
  type: CallsActionTypes.GET_CALLS,
});

/**
 * 取得來電者資訊(跟auth state分開避免被通知影響)
 * @param userId caller的id
 */
export const getCallerInfo = (userId: string) => {
  return {
    type: CallsActionTypes.GET_CALLER_INFO,
    payload: { userId },
  };
};

/**
 * 重設是否接到來電與是否被掛電話的state
 */
export const resetCallingStatus = () => ({
  type: CallsActionTypes.RESET_CALLING_STATUS,
});

// websocket event
export const callWebsocketEvent = (actionType: string) => ({
  type: CallsActionTypes.WS_EVENT,
  payload: { actionType },
});
