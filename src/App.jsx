import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LiveStream from './Components/pages/liveScream/LiveStream';
import JoinStream from './Components/pages/liveScream/JoinStream';
import Home from './Components/pages/Home';

export default class App extends Component {
  render() {
    return (
      <div className="containers">
        <Router>
          <Switch>
            <Route path="/" exact component={LiveStream} />
            <Route path="/stream" exact component={JoinStream} />
          </Switch>
        </Router>
      </div>
    );
  }
}
