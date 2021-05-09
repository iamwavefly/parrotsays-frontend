import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Moment from 'react-moment';

import { FiX, FiClock, FiUser } from 'react-icons/fi';

import '../../../styles/attendee.css';

class AttendeeFrame extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    return (
      <div className="attendeeContainer">
        <div className="usersHeader">
          <h2>Participants</h2>
          <FiX onClick={this.handleClick} className="rmIcon" />
        </div>
        <div className="usersContainer">
          {this.props.users.users?.users.map((user) => {
            return (
              <div className="user">
                {/* <div className="locat">*</div> */}
                <div className="name">
                  <FiUser className="icon user_icon" />
                  <span>{user}</span>
                </div>
                {/* <div className="timestamp">
                  <FiClock className="icon time_icon" />
                  <span>{<Moment toNow>{Date.now()}</Moment>}</span>
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state,
  };
};

export default connect(mapStateToProps)(AttendeeFrame);
