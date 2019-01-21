import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from "react-router-dom";
import { connect } from "react-redux";

import "./Navbar.css";
import UploadMedia from "./UploadMedia";
import MyMediaGallery from "./MyMediaGallery";

const NavItem = props => {
    const pageURI = window.location.pathname + window.location.search;
    const isActive = (props.path === pageURI) ? "active" : "";
    const aClassName = props.disabled ? "nav-link disabled" : "nav-link";

    return (
        <li className={`nav-item ${isActive}`}>
            {(props.to) ?
                <Link to={props.to} className={aClassName + " " + props.className}>
                    {props.name || props.children}
                    {(props.path === pageURI) ? (<span className="sr-only">(current)</span>) : ''}
                </Link> :
                <span className="nav-link">{props.children}</span>
            }
        </li>
    );
}

const CardWrapper = props => {
    return (
        <div className="card" id="AppBody">
            <div className="card-header"><h3>{props.header}</h3></div>
            <div className="card-body">
                {props.children}
            </div>
        </div>
    );
}

class Navbar extends Component {

    componentDidMount() {
        window.$('[data-toggle="popover"]').popover();
    }

    render() {

        return (
            <Router>
                <div className="my-app">
                    <header>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <Link className="navbar-brand" to="/">My Media Collection</Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <NavItem to="/" name="Home" />
                                    <NavItem to="/upload-media" name="Upload" />
                                    <NavItem to="/media-gallery" name="Gallery" />
                                    <NavItem to="/verify-media" name="Verify" />

                                </ul>
                                <ul className="navbar-nav justify-content-end">
                                    <NavItem className="nav-right">
                                        <span>
                                            Logged as: <span className="pop" data-toggle="popover" title="Logged User Address"
                                                data-content={this.props.account}><i className="fa fa-eye"></i></span></span>
                                    </NavItem>
                                </ul>
                                <form className="form-inline my-2 my-lg-0">
                                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                                </form>
                            </div>
                        </nav>
                    </header>
                    <main role="main" className="container-fluid">
                        <Switch>
                            <Route
                                path="/"
                                exact
                                render={() => (
                                    <CardWrapper header="Home">
                                        <h1>Home</h1>
                                    </CardWrapper>
                                )}
                            />
                            <Route
                                path="/upload-media"
                                exact
                                render={() => (
                                    <CardWrapper header="Media Upload Form">
                                        <UploadMedia />
                                    </CardWrapper>
                                )}
                            />
                            <Route
                                path="/media-gallery"
                                exact
                                render={() => (
                                    <CardWrapper header="My Media Gallery">
                                        <MyMediaGallery />
                                    </CardWrapper>
                                )}
                            />
                            <Route
                                path="/verify-media"
                                exact
                                render={() => (
                                    <CardWrapper header="Verify Uploaded Media">
                                        <h1>Verify Uploaded Media</h1>
                                    </CardWrapper>
                                )}
                            />
                        </Switch>
                    </main>
                </div>
            </Router>
        );
    }
}

function mapStateToProps({ initialize }) {
    return { ...initialize };
}

export default connect(
    mapStateToProps,
    null
)(Navbar);
