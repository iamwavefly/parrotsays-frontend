import React, { Component, useRef } from 'react';
import Fade from 'react-reveal/Fade';
import {
  MdMic,
  MdVideocam,
  MdScreenShare,
  MdForum,
  MdCallEnd,
} from 'react-icons/md';

import '../../../styles/userframe.css';

export default class UserFrame extends Component {
  playVideo() {
    const container = useRef;
    if (!container.current) return;
    this.props.videoTrack?.play(container.current);
    return () => {
      this.props.videoTrack?.stop();
    };
  }
  playAudio() {
    this.props.audioTrack?.play();
    return () => {
      this.props.audioTrack?.stop();
    };
  }
  handleChat(e) {
    e.preventDefault();
  }
  componentDidMount() {
    this.playVideo();
    this.playAudio();
  }

  render() {
    return (
      <div className="frameContainer">
        <div ref={this.container} className="frame">
          Frame
        </div>
        <Fade up>
          <div className="controls">
            <div className="audioControl">
              <MdMic className="icon audioIcon" />
              <span>Audio</span>
            </div>
            <div className="videoControl">
              <MdVideocam className="icon videoIcon" />
              <span>Video</span>
            </div>
            <div className="shareScreenControl">
              <MdScreenShare className="icon shareScreenIcon" />
              <span>Share</span>
            </div>
            <div className="chatControl" onClick={this.handleChat}>
              <MdForum className="icon chatIcon" />
              <span>Chat</span>
            </div>
            <div className="endStreamControl">
              <MdCallEnd className="icon chatIcon" />
              <span>End</span>
            </div>
          </div>
        </Fade>
      </div>
    );
  }
}
