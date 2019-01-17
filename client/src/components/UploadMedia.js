import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch, withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import InputField, { CheckBoxField, FileField, hasGetUserMedia, WebCamCapture } from "./shared/Input";
import { reduxForm, Field, formValueSelector } from "redux-form";
import * as actions from "../actions";

class UploadMedia extends Component {

    handleSubmit(values) {
        console.log(values);
        console.log(this.props);
        this.props.addMedia(values, this.props.history);
    }

    render() {
        const { pristine, reset, submitting } = this.props;

        return (
            <form onSubmit={this.props.handleSubmit(this.handleSubmit.bind(this))} noValidate>
                <legend></legend>
                <hr />
                <Field name="title" id="title" type="text" inputLabel="Associated Title with the Media" component={InputField} />
                <Field name="tags" id="tags" type="text" inputLabel="Tags that relate to the media" component={InputField} />
                <Field name="isCameraPicture" id="isCameraPicture" type="checkbox" inputLabel="Take media from Camera?" component={CheckBoxField} />
                {(this.props.isCameraMedia && hasGetUserMedia()) ?
                    <Field name="mediaFromCamera" component={WebCamCapture} /> :
                    <Field name="selectMedia" id="selectMedia" type="file" inputLabel="Select Media File..." component={FileField} className="form-control-file" />
                }
                <br />
                <button type="submit"  disabled={pristine || submitting} className="btn btn-outline-primary mr-sm-2">Submit</button>
                <button type="button" disabled={pristine || submitting} onClick={reset} className="btn btn-outline-warning">Clear Values</button>
            </form>
        );
    }
}

// function to validate form values
function validate(values) {
    let errors = {};

    errors = checkRequired(values, errors, "title", "Title");
    errors = checkRequired(values, errors, "tags", "Tags");
    if (values.isCameraPicture) {
        errors = checkRequired(values, errors, "mediaFromCamera", "Media From Camera");
    } else {
        errors = checkRequired(values, errors, "selectMedia", "Media File to Upload");
    }
    console.log(errors);

    return errors;
}

const checkRequired = (values, errors, name, label) => {
    if (!values[name]) {
        errors[name] = `${label} field must have a value`;
    }

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
)(withRouter(UploadMedia));

