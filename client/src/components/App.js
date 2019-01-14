import React, { Component } from "react";
import MediaManagerContract from "../contracts/MediaManager.json";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import "../css/font-awesome.min.css";
import "./App.css";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";

class App extends Component {

    componentDidMount = async () => {
        // Get network provider and web3 instance.
        await this.props.fetchWeb3();
    }

    render() {
        if (!this.props.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <Navbar />
                <Footer />
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
