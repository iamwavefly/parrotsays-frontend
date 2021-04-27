import React, { Component } from 'react';

export default class AttendeeFrame extends Component {
  render() {
    return (
      <div>
        <div id="local-player"></div>
        <div id="local-scream-id"></div>
        <div id="remote-playerlist"></div>
      </div>
    );
  }
}
