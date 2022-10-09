// types
import { CallsActionTypes, CallsState } from "./types";

export const INIT_STATE: CallsState = {
  calls: [],
  onCallingType: "",
  endCalling: false,
  hasAnswered: false,
  meetingId: 0,
};

const Calls = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case CallsActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CallsActionTypes.GET_CALLS: {
          return {
            ...state,
            calls: action.payload.data,
            isCallsFetched: true,
            getCallsLoading: false,
          };
        }

        case CallsActionTypes.GET_CALLER_INFO: {
          return {
            ...state,
            callingUserInfo: action.payload.data.user,
          };
        }

        default:
          return { ...state };
      }

    case CallsActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CallsActionTypes.GET_CALLS: {
          return {
            ...state,
            isCallsFetched: false,
            getCallsLoading: false,
          };
        }

        case CallsActionTypes.GET_CALLER_INFO:
          return { ...state };

        default:
          return { ...state };
      }

    case CallsActionTypes.GET_CALLS: {
      return {
        ...state,
        getCallsLoading: true,
        isCallsFetched: false,
      };
    }

    case CallsActionTypes.RESET_CALLING_STATUS: {
      state.onCallingType = "";
      state.endCalling = false;
      state.hasAnswered = false;
      return {
        ...state,
        callingUserInfo: undefined,
      };
    }

    case CallsActionTypes.WS_EVENT: {
      switch (action.payload.actionType) {
        case CallsActionTypes.ON_CALLING: {
          state.onCallingType = action.payload.data;
          state.endCalling = false;
          return {
            ...state,
          };
        }
        case CallsActionTypes.HANGUP_CALLING: {
          state.onCallingType = "";
          state.endCalling = true;
          return {
            ...state,
          };
        }
        case CallsActionTypes.ANSWERED_CALLING: {
          state.hasAnswered = true;
          return { ...state };
        }
        case CallsActionTypes.GET_MEETING_CREATE_BY_SELF: {
          state.meetingId = action.payload.data;
          return { ...state };
        }
        default:
          return { ...state };
      }
    }

    default:
      return { ...state };
  }
};

export default Calls;
