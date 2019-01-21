import React, { Component } from "react";
import {
    withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import { 
    InputField, 
    CheckBoxField, 
    FileField, 
    hasGetUserMedia, 
    WebCamCapture,
    TagInput 
} from "./shared/Input";
import { reduxForm, Field, formValueSelector } from "redux-form";
import { required, file } from 'redux-form-validators'
import * as actions from "../actions";

import "./shared/react-tag-input.css";

class UploadMedia extends Component {

    handleSubmit(values) {
        const { contractInstance, account, web3, history } = this.props;
        this.props.addMedia(values, contractInstance, account, web3, history);
    }

    render() {
        const { pristine, reset, submitting } = this.props;
        // console.log(this.props.contractInstance);
        return (
            <form onSubmit={this.props.handleSubmit(this.handleSubmit.bind(this))} noValidate>
                <legend></legend>
                <hr />
                <Field name="title" id="title" type="text" 
                    inputLabel="Associated Title with the Media" component={InputField} />
                <Field name="tags" id="tags" type="text" 
                    inputLabel="Tags that relate to the media" component={TagInput} />
                <Field name="isCameraPicture" id="isCameraPicture" type="checkbox" 
                    inputLabel="Take media from Camera?" component={CheckBoxField} />
                {(this.props.isCameraMedia && hasGetUserMedia()) ?
                    <Field name="mediaFromCamera" component={WebCamCapture} /> :
                    <Field name="selectMedia" id="selectMedia" type="file" inputLabel="Select Media File..." 
                        component={FileField} className="form-control-file" />
                }
                <br />
                <button type="submit" disabled={pristine || submitting} 
                    className="btn btn-outline-primary mr-sm-2">Submit</button>
                <button type="button" disabled={pristine || submitting} 
                    onClick={reset} className="btn btn-outline-warning">Clear Values</button>
            </form>
        );
    }
}

// validations for the current form
const rf = "This field is required.";
let validations = {
    title: [required({message: rf})],
    tags: [required({message: rf})],
    mediaFromCamera: [
        required({ 
            if: (values, value) => { return values.isCameraPicture }, 
            message: "You must take a photo capture." }
        )
    ],
    selectMedia: [
        required({ if: (values, value) => { return !values.isCameraPicture }, message: rf }), 
        file({
            accept: 'image/*, video/mp4, video/avi, video/flv',
            maxSize: '30 MB', // max file upload set to 30 MB
            maxFiles: 1
        })
    ]
}

// function to validate form values
function validate(values) {
    const errors = {}
    for (let field in validations) {
        let value = values[field]
        errors[field] = validations[field].map(validateField => {
            return validateField(value, values)
        }).find(x => x)
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

