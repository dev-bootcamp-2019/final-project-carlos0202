import React, { Component } from "react";
import {
    Link,
    withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import { getFileUrl } from "../utils/getIPFS";

import "./MyMediaGallery.css";

export const MediaItem = (props) => {
    const { title, tags, isVideo, mediaHash, mediaOwner, timestamp, account, colSpan } = props;

    async function handleDelete(mediaHash, props, isSearch) {
        let result = await window.Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure to delete this media file? This action can't be undone!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.value) {
            const { contractInstance, account, totalAddedFiles } = props;
            const caller = isSearch ? "SEARCH": "GALLERY";
            await props.deleteOwnedMedia(contractInstance, account, mediaHash, totalAddedFiles, caller);
        } else {
            window.Swal.fire(
                'Operation Cancelled!',
                'Your media file is safe!',
                'info'
            );
        }
    }
    const path = props.location.pathname;
    return (
        <div className={`card owned-media col-lg-${colSpan}`}>
            <div className="media-object">
                {isVideo ?
                    <video className="media-video mx-auto d-block" controls>
                        <source src={`${getFileUrl}${mediaHash}`}></source>
                    </video> :
                    <img className="media-img mx-auto d-block loading" src={`${getFileUrl}${mediaHash}`} alt={title + " " + tags} />
                }
            </div>
            <div className="media-body">
                <h5 className="mt-0"><span className="text-muted">Title: </span>{title}</h5>
                <hr />
                <div className="card pl-1 pr-1">
                    <span className="text-muted">Associated Tags: </span>
                    <p>{tags.split(",").map((tag, index) => <span className="badge badge-info mr-2" key={index}>{tag}</span>)}</p>
                </div>
                <hr />
                <p><span className="text-muted">Date Created: </span>{new Date(timestamp * 1000).toDateString()}</p>
                <hr />
                <p><span className="text-muted">Proof: </span>{mediaHash}</p>
            </div>
            <div className="card-footer">
                {
                    account === mediaOwner ?
                        <div className="btn-toolbar">
                            <div className="media-actions">
                                <button className="btn btn-danger" onClick={() => handleDelete(mediaHash, props, path.startsWith("/search-media"))}>Delete</button>
                            </div>
                            {
                                !path.startsWith("/search-media") &&
                                <Link to={`/search-media/${mediaHash}`} className="btn btn-info ml-1" >
                                    View Full
                                </Link>
                            }
                        </div> :
                        <p><span className="text-muted">Owner: </span>{mediaOwner}</p>
                }
            </div>
        </div>
    );
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
                    userMedia.map((item, index) => <MediaItem {...item} {...extraProps} key={index} colSpan={5} />)
                }
                {(mediaFetched && !userMedia.length) && <p>You have not added any new file yet. Try uploading content and try again.</p>}
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