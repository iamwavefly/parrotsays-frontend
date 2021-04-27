import React, { Component } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import Axios from 'axios';

export default class Stream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoTrack: null,
      audioTrack: null,
      appid: '306d86f1ec2644c3affab320daef132c',
      token: null,
      role: 'host',
      uid: '',
    };
    this.initStream = this.initStream.bind(this);
  }
  client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
  async initStream() {
    // create Agora client
    this.client.setClientRole(this.state.role);

    if (this.state.role === 'audience') {
      // add event listener to play remote tracks when remote user publishs.
      this.client.on('user-published', this.handleUserPublished);
      this.client.on('user-unpublished', this.handleUserUnpublished);
    }

    // join the channel
    this.setState({
      uid: await this.client.join(
        this.state.appid,
        this.props.channel,
        this.token.token || null
      ),
    });

    if (this.state.role === 'host') {
      // create local audio and video tracks
      this.state.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.state.videoTrack = await AgoraRTC.createCameraVideoTrack();
      // play local video track
      this.state.videoTrack.play('local-player');
      // publish local tracks to channel
      await this.client.publish(this.state.videoTrack, this.state.audioTrack);
      console.log('publish success');
    }
  }
  async subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await this.client.subscribe(user, mediaType);
    console.log('subscribe success');
    if (mediaType === 'video') {
      // const player = $(`
      //   <div id="player-wrapper-${uid}">
      //     <p class="player-name">remoteUser(${uid})</p>
      //     <div id="player-${uid}" class="player"></div>
      //   </div>
      // `);
      // $('#remote-playerlist').append(player);
      // user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  }

  handleUserPublished(user, mediaType) {
    const userId = user.uid;
    this.remoteUsers.filter((id) => {
      return id === userId;
    });
    this.subscribe(user, mediaType);
  }

  handleUserUnpublished(user) {
    const id = user.uid;
    // delete remoteUsers[id];
    // $(`#player-wrapper-${id}`).remove();
  }

  async componentDidMount() {
    if (this.props.username) {
      await Axios.post('http://localhost:4000/rtctoken', {
        channel: this.props.channel,
        isPublisher: true,
      }).then((res) => this.setState({ token: res.data.token }));
      console.log(this.state.token);
    } else {
      console.log('no username');
    }
    if (this.state.token) {
      this.initStream();
    }
  }
  render() {
    return <div></div>;
  }
}
