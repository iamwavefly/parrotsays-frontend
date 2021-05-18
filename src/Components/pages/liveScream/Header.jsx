import React, { Component } from 'react';
import Logo from '../../../img/parrotsays.jpeg';

import '../../../styles/header.css';

export default class Header extends Component {
  render() {
    return (
      <div className="headerContainer">
        {/* <img src={Logo} alt="parrotsays logo" className="logo" /> */}
        <button id="acquire">Acquire</button>
        <button id="start">Start</button>
        <button id="query">Query</button>
        <button id="stop">Stop</button>
      </div>
    );
  }
}
