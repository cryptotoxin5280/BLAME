import React, { Component } from 'react';
import logo from "./logo.svg";

class Header extends Component {

  render() {
    return (
      <div>
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="http://localhost:3000">
            <img alt="octoScope" width="25%" height="25%" src={ logo } />
          </a>
        </nav>
      </div>
    );
  }
}

export default Header;
