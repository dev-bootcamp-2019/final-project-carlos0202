import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="container-fluid">
                    <span className="text-muted">
                        Media Gallery DApp &#169; {new Date().toDateString()}
                    </span>
                </div>
            </footer>
        );
    }
}

export default Footer;
