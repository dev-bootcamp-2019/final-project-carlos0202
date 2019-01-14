//contains logic to render different kinds of input fields
import React, { Component } from 'react';

const InputField = ({ input, meta: { error, touched }, ...props }) => {

    return (
        <div className="form-group mb-3">
            <label htmlFor={props.id}>{props.inputLabel}</label>
            <input {...input} id={props.id} name={props.id} type={props.type} className={`validate form-control ${props.className}`} />
            <div className="invalid-feedback">
                {touched && error}
            </div>
        </div>
    );
};

export const CheckBoxField = ({ input, meta: { error, touched }, ...props }) => {

    return (
        <div className="form-group mb-3">
            <input {...input} id={props.id} name={props.id} type={props.type} className={`validate ${props.className}`}
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
                <input {...input} id={props.id} name={props.id} type="file" className={`validate form-control-file ${props.className}`}
                    onChange={this.onChange} />
                <div className="invalid-feedback">
                    {touched && error}
                </div>
            </div>
        );
    }
}

export default InputField;



