import { combineReducers } from "redux";
import { reducer as reduxForm } from "redux-form";
import rootReducer from "./rootReducer";

// Register all the reducers used in the app here.
export default combineReducers({
    initialize: rootReducer,
    form: reduxForm
});