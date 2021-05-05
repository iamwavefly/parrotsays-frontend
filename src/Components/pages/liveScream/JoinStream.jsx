import React, { Component } from 'react';
import AttendeeFrame from './AttendeeFrame';
import Chat from './Chat';
import Header from './Header';
import StreamControls from './StreamControls';
import JoinStreamHook from '../../../hooks/JoinStreamHook';

export default class JoinStream extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <Header />
          <AttendeeFrame />
          <JoinStreamHook />
          {/* <Chat /> */}
          <StreamControls />
        </div>
      </div>
    );
  }
}
