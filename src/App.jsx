import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LiveStream from './Components/pages/liveScream/LiveStream';
import JoinStream from './Components/pages/liveScream/JoinStream';
import StreamPlayBack from './Components/pages/liveScream/StreamPlayBack';

export default class App extends Component {
  render() {
    return (
      <div className="containers">
        <Router>
          <Switch>
            <Route path="/" exact component={LiveStream} />
            <Route path="/playback" component={StreamPlayBack} />
            <Route path="/stream" component={JoinStream} />
          </Switch>
        </Router>
      </div>
    );
  }
}
