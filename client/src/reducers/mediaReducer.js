import { PUSH_FILE, GET_FILES_COUNT } from "../actions/types";

export function addMedia(state = {}, action) {
    switch (action.type) {
        case PUSH_FILE:
            return action.payload;

        default:
            return state;
    }
}

export function getFilesCount(state = {totalAddedFiles: 0, currentFilesCount: 0}, action) {
    switch(action.type){
        case GET_FILES_COUNT:
            return {
                totalAddedFiles: action.payload.totalAddedFiles.toNumber(), 
                currentFilesCount: action.payload.currentFilesCount.toNumber() 
            };
        default: 
            return state;
    }
}