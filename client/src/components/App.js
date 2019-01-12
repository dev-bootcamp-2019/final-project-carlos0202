import React, { Component } from "react";
import MediaManagerContract from "../contracts/MediaManager.json";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import "./App.css";

class App extends Component {

    componentDidMount = async () => {
        // Get network provider and web3 instance.
        await this.props.fetchWeb3();
        console.log(this.props);
        await this.runExample();
    };
    
    runExample = async () => {
        const tx = await this.props.contractInstance.methods.lastMediaIndex.call(
            { from: this.props.account }
        ).call();
        console.log(tx);
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
    console.log(initialize)
    return { ...initialize };
}

export default connect(
    mapStateToProps,
    actions
)(App);
