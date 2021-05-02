import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import {
  MdMic,
  MdVideocam,
  MdScreenShare,
  MdForum,
  MdCallEnd,
} from 'react-icons/md';
import '../../../styles/streamControls.css';

export default class StreamControls extends Component {
  handleClick(e) {
    const chatContainer = document.getElementById('chatContainer');
    if (e.target.classList.contains('control')) {
      e.target.classList.toggle('mute');
    }
    if (e.target.classList.contains('chatControl')) {
      console.log('got click');
      chatContainer.classList.toggle('toggleChat');
    }
  }
  render() {
    return (
      <Fade up>
        <div className="controls">
          <div className="controlContainer">
            <div
              id="audioControl"
              onClick={this.handleClick}
              className="control audioControl"
            >
              <MdMic className="icon audioIcon" />
            </div>
            <div
              id="videoControl"
              onClick={this.handleClick}
              className="control videoControl"
            >
              <MdVideocam className="icon videoIcon" />
            </div>
            <div
              onClick={this.handleClick}
              className="control shareScreenControl"
            >
              <MdScreenShare className="icon shareScreenIcon" />
            </div>
            <div onClick={this.handleClick} className="control chatControl">
              <MdForum className="icon chatIcon" />
            </div>
            <div id="endStreamControl" className="endStreamControl">
              <MdCallEnd className="icon chatIcon" />
            </div>
          </div>
        </div>
      </Fade>
    );
  }
}
