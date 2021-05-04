import React, { Component } from 'react';
import joinStream from '../../../hooks/joinStream';
import Stream from '../../../hooks/Stream';
import AttendeeFrame from '../liveScream/AttendeeFrame';
import Header from '../liveScream/Header';
import StreamControls from '../liveScream/StreamControls';
import Chat from '../liveScream/Chat';

export default class index extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <Header />
          <AttendeeFrame />
          {/* <Chat /> */}
          <StreamControls />
        </div>
      </div>
    );
  }
}
