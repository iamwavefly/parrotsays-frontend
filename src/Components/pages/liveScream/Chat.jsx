import React, { Component } from 'react';
import { updateUsers } from '../../../action/addMsg';
import { connect } from 'react-redux';
import { FiX } from 'react-icons/fi';
import Axios from 'axios';
import InputEmoji from 'react-input-emoji';
import AgoraRTM from 'agora-rtm-sdk';

import msgNotif from '../../../assets/sound/chat-notification.mp3';
import '../../../styles/chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    let params = new URLSearchParams(window.location.search);
    this.state = {
      msg: [],
      users: [],
      text: '',
      sound: new Audio(msgNotif),
      username: params?.get('username'),
      channel: params?.get('user_id'),
    };
    this.handleOnEnter = this.handleOnEnter.bind(this);
    this.initChat = this.initChat.bind(this);
    this.handleSendMsg = this.handleSendMsg.bind(this);
  }
  handleClick(e) {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.classList.toggle('toggleChat');
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };
  client = AgoraRTM.createInstance('306d86f1ec2644c3affab320daef132c', {
    enableLogUpload: false,
  });
  params = new URLSearchParams(window.location.search);
  channelUrl =
    window.location.pathname === '/stream/'
      ? this.params?.get('channel')
      : this.params?.get('username');
  channel = this.client.createChannel(this.channelUrl);
  async initChat() {
    const getChannelMsg = (msg, user) => {
      let newMsg = {
        sender: user,
        msg: msg,
        msgId: Math.floor(Math.random() * 99),
      };
      this.setState({ msg: [...this.state.msg, newMsg] });
    };
    // Client Event listeners
    // Display messages from peer
    this.client.on('MessageFromPeer', function (message, peerId) {
      this.setState({ msg: [...this.state.msg, message + peerId] });
    });
    // Display connection state changes
    this.client.on('ConnectionStateChanged', (state, reason) => {
      console.log('State changed To: ' + state + ' Reason: ' + reason);
    });
    this.channel.on('ChannelMessage', (message, memberId) => {
      console.log(message.text + ' from ' + memberId);
      getChannelMsg(message.text, memberId);
      this.state.sound.play();
    });
    // Display channel member stats
    this.channel.on('MemberJoined', function (memberId) {
      let msg = memberId + ' joined the channel';
      getChannelMsg(msg, 'ParrotSays bot');
    });
    // Display channel member stats
    this.channel.on('MemberLeft', function (memberId) {
      let msg = memberId + ' left the channel';
      getChannelMsg(msg, 'ParrotSays bot');
    });
    // Button behavior
    // Buttons
    // login

    await this.client.login({
      uid: this.state.username,
      token: this.state.token,
    });
    await this.channel.join().then(() => {
      console.log(
        'You have successfully joined channel ' + this.channel.channelId
      );
    });
    await this.channel
      .getMembers()
      .then((users) => {
        this.setState({ users: users });
        this.props.updateUsers(this.state.users);
      })
      .catch((err) => console.log(err));
  }

  async handleSendMsg(text) {
    if (this.channel !== null) {
      await this.channel.sendMessage({ text: text }).then(() => {
        let newMsg = { sender: 'self', msg: text };
        this.setState({ msg: [...this.state.msg, newMsg] });
      });
    }
  }
  async componentDidMount() {
    this.scrollToBottom();
    if (this.state.username) {
      await Axios.post('https://parrotsays-backend.herokuapp.com/rtmtoken', {
        user: this.state.username,
      }).then((res) => this.setState({ token: res.data.token }));
      console.log(this.state.username);
    } else {
      console.log('no username');
    }
    if (this.state.token) {
      this.initChat(this.state.token);
    } else {
      console.log('not yet');
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  handleOnEnter(text) {
    if (text !== '') {
      this.handleSendMsg(text);
    }
    console.log(this.state.msg);
  }

  render() {
    return (
      <div className="chatContainer" id="chatContainer">
        <div className="msgHeader">
          <h2>Chat {/*<span>{this.props.msgs.length}</span> */}</h2>
          <FiX onClick={this.handleClick} className="rmIcon" />
        </div>
        <div className="msgContainer">
          {this.state.msg.map((msg) => {
            return (
              <div>
                <div key={msg.msgId} className={`msg ${msg.sender}`}>
                  {msg.msg}
                </div>
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
    updateUsers: (users) => {
      dispatch(updateUsers(users));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
