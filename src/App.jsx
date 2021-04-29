import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LiveStream from './Components/pages/liveScream/LiveStream';

export default class App extends Component {
  render() {
    return (
      <div className="containers">
        <LiveStream />
      </div>
    );
  }
}
