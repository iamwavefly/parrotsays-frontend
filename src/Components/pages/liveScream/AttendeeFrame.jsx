import React, { Component } from 'react';
import '../../../styles/attendee.css';

export default class AttendeeFrame extends Component {
  render() {
    return (
      <div className="attendeeContainer">
        <div className="local-player"></div>
        <div id="remote-screen"></div>
        <div id="remote-player"></div>
      </div>
    );
  }
}
