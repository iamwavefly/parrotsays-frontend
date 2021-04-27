import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import AgoraRTM from 'agora-rtm-sdk';
import LiveStream from './Components/pages/liveScream/LiveStream';
import Login from './Components/pages/login/Login';

export default class App extends Component {
  render() {
    return (
      <div className="containers">
        <Router>
          <Switch>
            <div>
              <Route path="/" exact component={Login} />
              <Route path="/stream" component={LiveStream} />
            </div>
          </Switch>
        </Router>
      </div>
    );
  }
}
