//contains logic to render different kinds of input fields
import React, { Component } from 'react';
import Webcam from "react-webcam";
import { WithContext as ReactTags } from 'react-tag-input';

export const InputField = ({ input, meta: { error, touched }, ...props }) => {

    return (
        <div className="form-group mb-3">
            <label htmlFor={props.id}>{props.inputLabel}</label>
            <input {...input} id={props.id} name={props.id} type={props.type}
                className={`validate form-control ${props.className}  ${props.className} ${(touched && error != null) ? 'is-invalid' : 'is-valid'}`} />
            <div className="invalid-feedback">
                {touched && error}
            </div>
        </div>
    );
};

export const CheckBoxField = ({ input, meta: { error, touched }, ...props }) => {

    return (
        <div className="form-group mb-3">
            <input {...input} id={props.id} name={props.id}
                className={`validate ${props.className} ${(touched && error != null) ? 'is-invalid' : 'is-valid'}`}
                type="checkbox" />
            <label htmlFor={props.id}>{props.inputLabel}</label>
            <div className="invalid-feedback">
                {touched && error}
            </div>
        </div>
    );
};

export class FileField extends Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        const { input: { onChange } } = this.props
        onChange(e.target.files[0])
    }

    render() {
        const { input, meta: { error, touched }, ...props } = this.props;
        delete input.value; // to prevent uncontrolled to controlled input error.

        return (
            <div className="form-group mb-3">
                <label htmlFor={props.id}>{props.inputLabel}</label>
                <input {...input} id={props.id} name={props.id} type="file"
                    className={`validate form-control-file ${props.className} ${(touched && error != null) ? 'is-invalid' : 'is-valid'}`}
                    onChange={this.onChange} />
                <div className="invalid-feedback">
                    {touched && error}
                </div>
            </div>
        );
    }
}

export class WebCamCapture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screenshot: null
        };
    }
    handleClick = () => {
        const screenshot = this.webcam.getScreenshot();
        this.setState({ screenshot }, function(){
            this.props.input.onChange(screenshot);
        });
    }
    render() {
        const { input, meta: { error, touched }, ...props } = this.props;

        return (
            <div>
                <div className="embed-responsive embed-responsive-4by3">
                    <Webcam
                        audio={false}
                        value={this.state.screenshot}
                        ref={node => this.webcam = node}
                        className="embed-responsive-item"
                        screenshotFormat="image/jpeg"
                    />
                    <br />
                    <div className="text-danger mt-sm-3">
                        {touched && error}
                    </div>
                </div>
                <br />
                <div className="form-group">
                    <button type="button" className="btn btn-info" onClick={this.handleClick}>Capture</button>
                </div>
                <div className="form-group">
                    <h4>Captured Media:</h4>
                    <div className="embed-responsive">
                        {this.state.screenshot ? <img className="img-fluid" src={this.state.screenshot} /> : null}
                    </div>

                </div>
            </div>
        );
    }
}

export function hasGetUserMedia() {
    return !!(
        (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );
}

const suggestions = [];
const KeyCodes = {
    comma: 188,
    enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

export class TagInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: [],
            suggestions: suggestions,
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.getTags = this.getTags.bind(this);
    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        }, function(){
            this.props.input.onChange(this.getTags());
        });
    }

    handleAddition(tag) {
        const tags = [...this.state.tags, tag];
        this.setState({ tags }, function(){
            this.props.input.onChange(this.getTags());
        });        
    }

    getTags(){
        return this.state.tags.map((tag, index) => tag.id).join();
    }

    render() {
        const { tags, suggestions } = this.state;
        const { input, meta: { error, touched }, ...props } = this.props;

        return (
            <div className="card  mb-3">
                <div className="card-header"><label htmlFor={props.id}>{props.inputLabel}</label></div>
                <div className="card-body">
                    <ReactTags
                        tags={tags}
                        suggestions={suggestions}
                        delimiters={delimiters}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        allowDragDrop={false}
                    />
                    <div className="text-danger mt-sm-3">
                        {touched && error}
                    </div>
                </div>

            </div>
        );
    }
}



