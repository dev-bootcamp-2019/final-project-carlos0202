import { FETCH_WEB3 } from "../actions/types";

export default function(state = {web3: null, accounts: null, contractInstance: null, account: null} , action) {
    switch (action.type) {
      case FETCH_WEB3:
        return action.payload;
  
      default:
        return state;
    }
  }