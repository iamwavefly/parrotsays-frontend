import React, { Component, useRef } from 'react';
import { FiSmile } from 'react-icons/fi';

import '../../../styles/userframe.css';

export default class UserFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    console.log(this.props, '----------------');
  }
  handleChat(e) {
    e.preventDefault();
  }
  render() {
    return (
      <div className="frameContainer">
        <div className="frame" id="local-player">
          <FiSmile className="frameIcon" />
        </div>
      </div>
    );
  }
}
