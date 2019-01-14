import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div>
        <footer id="footer">
          <div className="container-fluid">
            <span className="text-muted pull-left">
                Carlos Antonio Gonz&aacute;lez Canario
            </span>
            <span className="text-muted pull-right">
              Media Gallery DApp &#169; {new Date().toDateString()}
            </span>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
