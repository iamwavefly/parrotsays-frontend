/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from 'react';
import Axios from 'axios';

import { connect } from 'react-redux';
import AgoraRTM from 'agora-rtm-sdk';
import AttendeeFrame from './AttendeeFrame';
import Stream from '../../../hooks/Stream';
import Chat from './Chat';
import Header from './Header';
import UserFrame from './UserFrame';

import '../../../styles/index.css';

class LiveStream extends Component {
  constructor(props) {
    super(props);
    let params = new URLSearchParams(window.location.search);
    this.state = {
      msg: [],
      token: null,
      username: params?.get('username'),
      channel: params?.get('user_id'),
      role: params?.get('role'),
    };
    this.initChat = this.initChat.bind(this);
    this.handleSendMsg = this.handleSendMsg.bind(this);
  }
  client = AgoraRTM.createInstance('306d86f1ec2644c3affab320daef132c', {
    enableLogUpload: false,
  });
  params = new URLSearchParams(window.location.search);
  channel = this.client.createChannel(this.params?.get('user_id'));
  async initChat() {
    const getChannelMsg = (msg, user) => {
      let newMsg = { sender: user, msg: msg };
      this.setState({ msg: [...this.state.msg, newMsg] });
    };
    // Client Event listeners
    // Display messages from peer
    this.client.on('MessageFromPeer', function (message, peerId) {
      this.setState({ msg: [...this.state.msg, message + peerId] });
    });
    // Display connection state changes
    this.client.on('ConnectionStateChanged', function (state, reason) {
      console.log('State changed To: ' + state + ' Reason: ' + reason);
    });
    this.channel.on('ChannelMessage', function (message, memberId) {
      console.log(message + 'from' + memberId);
      getChannelMsg(message.text, memberId);
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
  render() {
    return (
      <div>
        <div className="container">
          <Header />
          <AttendeeFrame />
          <Stream
            channel={this.state.channel}
            username={this.state.username}
            role={this.state.role}
          />
          <Chat handleSendMsg={this.handleSendMsg} msgs={this.state.msg} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(LiveStream);
