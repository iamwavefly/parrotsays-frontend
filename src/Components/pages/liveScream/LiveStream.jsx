/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import AttendeeFrame from './AttendeeFrame';
import Stream from '../../../hooks/Stream';
import Chat from './Chat';
import Header from './Header';

import '../../../styles/index.css';
import StreamControls from './StreamControls';

class LiveStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [],
      token: null,

      role: 'host',
    };
  }

  async componentDidMount() {}
  render() {
    return (
      <div>
        <div className="container">
          <Header />
          <AttendeeFrame />
          <Stream />
          <Chat />
          <StreamControls />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(LiveStream);
