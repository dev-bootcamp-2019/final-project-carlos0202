import * as T from "../actions/types";

export function addMedia(state = {}, action) {
    switch (action.type) {
        case T.PUSH_FILE:
            return action.payload;

        default:
            return state;
    }
}

export function getFilesCount(state = {totalAddedFiles: 0, currentFilesCount: 0}, action) {
    switch(action.type){
        case T.GET_FILES_COUNT:
            return {
                totalAddedFiles: action.payload.totalAddedFiles.toNumber(), 
                currentFilesCount: action.payload.currentFilesCount.toNumber() 
            };
        default: 
            return state;
    }
}

export function getOwnedMedia(state = [], action){
    switch(action.type){
        case T.GET_USER_MEDIA:
            return action.payload;
        default:
            return state;
    }
}