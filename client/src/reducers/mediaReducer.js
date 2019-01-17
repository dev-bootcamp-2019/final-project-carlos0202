import { PUSH_FILE } from "../actions/types";

export function addMedia(state = {} , action) {
    switch (action.type) {
      case PUSH_FILE:
        return action.payload;
  
      default:
        return state;
    }
  }