//contains logic to render different kinds of input fields
import React, { Component } from 'react';
import Webcam from "react-webcam";

const InputField = ({ input, meta: { error, touched }, ...props }) => {

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
        this.setState({ screenshot });
        this.props.input.onChange(screenshot);
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

export default InputField;



