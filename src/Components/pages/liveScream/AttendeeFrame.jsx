import React, { Component } from 'react';
import '../../../styles/attendee.css';

export default class AttendeeFrame extends Component {
  render() {
    return (
      <div className="attendeeContainer">
        <div class="local-player"></div>
        <div id="local-scream-id"></div>
        <div id="remote-playerlist"></div>
      </div>
    );
  }
}
