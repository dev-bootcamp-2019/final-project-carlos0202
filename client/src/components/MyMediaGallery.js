import React, { Component } from "react";
import {
    withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import { getFileUrl } from "../utils/getIPFS";

import "./MyMediaGallery.css";

export const MediaItem = (props) => {
    const { title, tags, isVideo, mediaHash, mediaOwner, timestamp, account } = props;
    console.log(account, mediaOwner);
    return (
        <div className="card owned-media col-md-5">
            <div className="media-object">
                {isVideo ?
                    <video className="media-video mx-auto d-block" controls>
                        <source src={`${getFileUrl}${mediaHash}`}></source>
                    </video> :
                    <img className="media-img mx-auto d-block" src={`${getFileUrl}${mediaHash}`} alt={title + " " + tags} />
                }
            </div>
            <div className="media-body">
                <h5 className="mt-0">{title}</h5>
                <p>{tags.split(",").map((tag, index) => <span className="badge badge-info mr-2" key={index}>{tag}</span>)}</p>
                <p>{new Date(timestamp * 1000).toDateString()}</p>
                <p>{mediaHash}</p>
            </div>
            { 
                account == mediaOwner &&
                <div className="media-actions">
                    <button className="btn btn-danger">Delete</button>
                </div>
            }
            
        </div>
    )
};

class MyMediaGallery extends Component {
    componentDidMount = async () => {
        const { web3, contractInstance, account } = this.props;
        await this.props.getFilesCount(web3, contractInstance, account);
        await this.props.getOwnedMedia(contractInstance, account, this.props.totalAddedFiles);
    }

    render() {
        const { userMedia, mediaFetched, ...extraProps } = this.props;

        return (
            <div className="row justify-content-center">
                {
                    mediaFetched &&
                    userMedia.map((item, index) => <MediaItem {...item} {...extraProps} key={index} />)
                }
            </div>
        )
    }
}

function mapStateToProps({ initialize, filesCount, myMedia }) {

    return { ...initialize, ...filesCount, ...myMedia };
}

export default connect(
    mapStateToProps,
    actions
)(withRouter(MyMediaGallery));