import React, { Component } from "react";
import {
    withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import { MediaItem } from "./MyMediaGallery";

class SearchMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchMediaValue: ""
        };
    }

    componentDidMount = async () => {
        const { contractInstance, account } = this.props;

        const mediaHash = this.props.match.params.mediaHash;
        await this.props.getMediaByHash(mediaHash, contractInstance, account);
    }

    searchMedia = async () => {
        const mediaHash = this.state.searchMediaValue
        const { history, contractInstance, account } = this.props;
        await this.props.getMediaByHash(mediaHash, contractInstance, account);
        history.push(`/search-media/${mediaHash}`);
    }

    onBlur(event) {
        this.setState({ searchMediaValue: event.target.value });
    }

    render() {
        const { searchedMedia } = this.props;
        const { params } = this.props.match;

        return (
            <div className="row justify-content-center">
                <div className="col-sm-10 col-sm-offset-1">
                    <div className="input-group mb-3">
                        <input className="form-control" type="search" placeholder="Search"
                            defaultValue={params && params.mediaHash} aria-label="Search"
                            onBlur={this.onBlur.bind(this)} />
                        <div className="input-group-append">
                            <button className="btn btn-outline-success" type="button"
                                onClick={this.searchMedia.bind(this)}>
                                Search
                        </button>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    {(searchedMedia != null) ?
                        <MediaItem {...this.props} {...searchedMedia} colSpan={11} /> :
                        <div className="col-12">
                            {(params && params.mediaHash) ?
                                <p>
                                    The file your requested was not found. Try a different value. <br />
                                    Requested: {params.mediaHash}
                                </p> :
                                <p>Use the search bar at the top to find an uploaded media file along with its info.</p>
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps({ initialize, searchedMedia, searchMediaValue }) {

    return { ...initialize, searchedMedia, searchMediaValue };
}

export default connect(
    mapStateToProps,
    actions
)(withRouter(SearchMedia));