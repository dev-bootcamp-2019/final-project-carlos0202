import React, { Component } from "react";
import {
    withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

export const MediaItem = (props) => {
    return (
        <div className="media">
            <img className="mr-3" src="..." alt="Generic placeholder image" />
            <div className="media-body">
                <h5 className="mt-0">Media heading</h5>
                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
            </div>
        </div>
    )
};

class MyMediaGallery extends Component {
    componentDidMount = async () => {
        console.log(this.props);
    }

    render(){
        return (
            <MediaItem />
        )
    }
}

function mapStateToProps({initialize, filesCount}) {

    return { ...initialize, ...filesCount };
}

export default connect(
    mapStateToProps,
    actions
)(withRouter(MyMediaGallery));