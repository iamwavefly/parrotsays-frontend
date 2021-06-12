import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LiveStream from './Components/pages/liveScream/LiveStream';
import JoinStream from './Components/pages/liveScream/JoinStream';
import StreamPlayBack from './Components/pages/liveScream/StreamPlayBack';
import CreateStream from './Components/pages/liveScream/CreateStream';

export default class App extends Component {
  render() {
    return (
      <div className="containers">
        <Router>
          <Switch>
            <Route path="/" exact component={CreateStream} />
            <Route path="/playback" component={StreamPlayBack} />
            <Route path="/stream" exact component={JoinStream} />
            <Route path="/stream/new" component={LiveStream} />
          </Switch>
        </Router>
      </div>
    );
  }
}
