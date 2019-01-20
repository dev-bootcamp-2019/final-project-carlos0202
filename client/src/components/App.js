import React, { Component } from "react";
import MediaManagerContract from "../contracts/MediaManager.json";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import { Spinner } from "react-redux-spinner";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";

import "../css/font-awesome.min.css";
import "./App.css";
import 'react-redux-spinner/dist/react-redux-spinner.css';

class App extends Component {

    componentDidMount = async () => {
        // Get network provider and web3 instance.
        await this.props.fetchWeb3();
        const {contractInstance, web3, account} = this.props;
        await this.props.getFilesCount(web3, contractInstance, account);
    }

    render() {
        if (!this.props.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <Spinner />
                <Navbar />
                <Footer />
            </div>
        );
    }
}

function mapStateToProps({ initialize, filesCount, pendingTasks }) {
    return { ...initialize, ...filesCount, ...pendingTasks };
}

export default connect(
    mapStateToProps,
    actions
)(App);
