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
import SearchMedia from "./SearchMedia";

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
            <div className={`card-header ${props.headerClasses} `}><h3>{props.header}</h3></div>
            <div className={`card-body ${props.bodyClasses}`}>
                {props.children}
            </div>
        </div>
    );
}

const Home = (props) => {
    return (
        <div className="jumbotron">
            <h1 className="display-4">Hello, Dear User!</h1>
            <p className="lead">
                This is the <strong>My Media Collection DApp</strong>. We provide services to allow our users to upload media that belongs to them,
                so that they could later share a proof of these files with others. Searching in our site using the proof token
                provided by the owners We display the data related to that proof, including the date added.
            </p>
            <hr className="my-4" />
            <p>You are currently logged in using the wallet address: <strong>{props.account}</strong>.</p>
            <p>All your transactions will be signed using this address as your identifier of ownership.</p>
            <hr className="my-4" />
            <p>Please enyoy our services built upon the Ethereum network. Use the button bellow to start uploading your content.</p>
            <Link className="btn btn-primary btn-lg" to="/upload-media" role="button">Upload Files</Link>
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
                                    <NavItem to="/search-media" name="Search" />

                                </ul>
                                <ul className="navbar-nav justify-content-end">
                                    <NavItem className="nav-right">
                                        <span>
                                            Logged as: <a className="pop" data-toggle="popover" title="Logged User Address"
                                                tabIndex="0" data-trigger="focus" data-container="body" data-placement="bottom"
                                                data-content={this.props.account}><i className="fa fa-eye"></i></a></span>
                                    </NavItem>
                                </ul>
                            </div>
                        </nav>
                    </header>
                    <main role="main" className="container-fluid">
                        <Switch>
                            <Route
                                path="/"
                                exact
                                render={() => (
                                    <CardWrapper header="My Media Collection DApp" headerClasses="text-center">
                                        <Home account={this.props.account} />
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
                                path="/search-media/:mediaHash?"
                                exact
                                render={() => (
                                    <CardWrapper header="Search Uploaded Media">
                                        <SearchMedia />
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
