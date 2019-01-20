import { combineReducers } from "redux";
import { reducer as reduxForm } from "redux-form";
import rootReducer from "./rootReducer";
import * as mediaReducers from "./mediaReducer";
import { pendingTasksReducer } from "react-redux-spinner";

// Register all the reducers used in the app here.
export default combineReducers({
    initialize: rootReducer,
    media: mediaReducers.addMedia,
    filesCount: mediaReducers.getFilesCount,
    pendingTasks: pendingTasksReducer,
    form: reduxForm
});