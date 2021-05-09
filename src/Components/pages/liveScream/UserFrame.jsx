import React, { Component, useRef } from 'react';
import { FiSmile } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';
import { connect } from 'react-redux';

import '../../../styles/userframe.css';

class UserFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    console.log(this.props, '-------props---------');
  }
  handleChat(e) {
    e.preventDefault();
  }
  render() {
    return (
      <div className="frameContainer">
        <div className="frame" id="local-player">
          <div className="badge">
            <div className="liveStreamBadge">
              <span>Live</span>
              <div className="livePointer"></div>
            </div>
            <div className="activeUserBadge">
              <FaEye className="activeIcon" />
              <span>{this.props.users.users?.users.length}</span>
            </div>
          </div>
          <FiSmile className="frameIcon" />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  console.log(state, '-------------------userframe-------------');
  return {
    users: state,
  };
};
export default connect(mapStateToProps)(UserFrame);
