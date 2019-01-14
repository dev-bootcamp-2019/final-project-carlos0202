import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from "react-router-dom";
import { connect } from "react-redux";
import InputField, { CheckBoxField, FileField } from "./shared/Input";
import { reduxForm, Field, formValueSelector } from "redux-form";
import * as actions from "../actions";

class UploadMedia extends Component {

    render() {
        console.log(this.props);

        return (
            <form>
                <legend></legend>
                <hr />
                <Field name="title" id="title" type="text" inputLabel="Associated Title with the Media" component={InputField} />
                <Field name="tags" id="tags" type="text" inputLabel="Tags that relate to the media" component={InputField} />
                <Field name="isCameraPicture" id="isCameraPicture" type="checkbox" inputLabel="Take media from Camera?" component={CheckBoxField} />
                {!this.props.isCameraMedia ?
                    <Field name="selectMedia" id="selectMedia" type="file" inputLabel="Select Media File..." component={FileField} className="form-control-file" /> :
                    <button className="btn btn-primary mb-3">Grab From Camera</button>
                }
                <br />
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        );
    }
}



function validate(values){
    const errors = {};
    // console.log(values);

    return errors;
}

UploadMedia = reduxForm({
    validate,
    form: "uploadMediaForm"
})(UploadMedia);

const selector = formValueSelector("uploadMediaForm");

function mapStateToProps(state) {
    const isCameraMedia = selector(state, 'isCameraPicture');
    const { initialize } = state;

    return { isCameraMedia, ...initialize };
}

export default connect(
    mapStateToProps,
    actions
)(UploadMedia);

