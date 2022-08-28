// types
import { CallsActionTypes, CallsState } from "./types";

export const INIT_STATE: CallsState = {
  calls: [],
  onCalling: false,
  endCalling: false,
};

const Calls = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case CallsActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CallsActionTypes.GET_CALLS:
          return {
            ...state,
            calls: action.payload.data,
            isCallsFetched: true,
            getCallsLoading: false,
          };
        default:
          return { ...state };
      }

    case CallsActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CallsActionTypes.GET_CALLS:
          return {
            ...state,
            isCallsFetched: false,
            getCallsLoading: false,
          };

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
      state.onCalling = false;
      state.endCalling = false;
      return {
        ...state,
      };
    }

    case CallsActionTypes.WS_EVENT: {
      switch (action.payload.actionType) {
        case CallsActionTypes.ON_CALLING: {
          state.onCalling = true;
          state.endCalling = false;
          return {
            ...state,
          };
        }
        case CallsActionTypes.HANGUP_CALLING: {
          state.onCalling = false;
          state.endCalling = true;
          return {
            ...state,
          };
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
