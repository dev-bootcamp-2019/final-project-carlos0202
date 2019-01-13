import React, { Component } from "react";
import MediaManagerContract from "../contracts/MediaManager.json";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import "../css/font-awesome.min.css"
import "./App.css";

class App extends Component {

    componentDidMount = async () => {
        // Get network provider and web3 instance.
        await this.props.fetchWeb3();
        console.log(this.props);
        await this.runExample();
    };
    
    runExample = async () => {
        let publicMediaHash;
        let mediaIndex;
        let mediaOwner;
        const mediaFileHash = 'QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVB';
        console.log(this.props.contractInstance);
        this.props.contractInstance.methods.addOwnedMedia(
            mediaFileHash,
                true,
                "Media file title",
                "Media file description"
        ).send({from: this.props.account}).then(tx => {
            let ev = tx.events.MediaAdded.returnValues;
            console.log(ev);
            publicMediaHash = ev.publicMediaHash;
            mediaIndex = ev.mediaIndex;
            mediaOwner = ev.mediaOwner;
            this.props.contractInstance.methods.getMedia(mediaIndex)
                .call({ from: this.props.account}).then(rs => {
                    console.log(rs);
                });
        }).catch(err => {
            console.log(err);
        });
    };

    render() {
        if (!this.props.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <h1>Good to Go!</h1>
                <p>{this.props.account}.</p>
            </div>
        );
    }
}

function mapStateToProps({ initialize }) {
    return { ...initialize };
}

export default connect(
    mapStateToProps,
    actions
)(App);
