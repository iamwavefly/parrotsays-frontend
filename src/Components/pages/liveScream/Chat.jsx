import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import { addMsg } from '../../../action/addMsg';
import { connect } from 'react-redux';
import { FiX } from 'react-icons/fi';
import InputEmoji from 'react-input-emoji';

import '../../../styles/chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      text: '',
    };
    this.handleOnEnter = this.handleOnEnter.bind(this);
    console.log('from chat', this.props.msgs);
  }

  handleOnEnter(text) {
    if (text !== '') {
      this.props.addNewMsg(text);
      this.props.handleSendMsg(this.props._msg);
      console.log(this.props._msg);
    }
  }
  handleClick(e) {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.classList.toggle('toggleChat');
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div className="chatContainer" id="chatContainer">
        <div className="msgHeader">
          <h2>Chat {/*<span>{this.props.msgs.length}</span> */}</h2>
          <FiX onClick={this.handleClick} className="rmIcon" />
        </div>
        <div className="msgContainer">
          {this.props.msgs.map((msg) => {
            return (
              <div>
                <div className={`msg ${msg.sender}`}>{msg.msg}</div>
                {msg.sender !== 'self' && (
                  <span className="sender">from {msg.sender}</span>
                )}
              </div>
            );
          })}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          ></div>
        </div>
        <InputEmoji
          name="msg"
          autoFocus="true"
          className="msgInput"
          cleanOnEnter
          onEnter={this.handleOnEnter}
          placeholder="Type a message"
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    _msg: state.newMsg,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addNewMsg: (msg) => {
      dispatch(addMsg(msg));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
