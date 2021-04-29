import React, { Component } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import Axios from 'axios';
import UserFrame from '../Components/pages/liveScream/UserFrame';
import '../styles/stream.css';

export default class Stream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoTrack: null,
      audioTrack: null,
      appid: '306d86f1ec2644c3affab320daef132c',
      token:
        '006306d86f1ec2644c3affab320daef132cIAB5z9vp3I8A+aAkfwZEySPVBhQ4RODJKYrlKfg1IM18wMW5sgcAAAAAEAALtir+q1aLYAEAAQCnVotg',
      channel: 'testboy',
      role: 'host',
      uid: '',
      remoteUsers: {},
      isActive: false,
    };
  }
  client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
  client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });

  async componentDidMount() {
    let state = this.state;
    // if (this.props.channel) {
    //   await Axios.post('http://localhost:4000/rtctoken1', {
    //     channel: this.props.channel,
    //     isPublisher: true,
    //   }).then((res) =>
    //     this.setState({ token: res.data.token, uid: res.data.uid })
    //   );
    // } else {
    //   console.log('no username');
    // }
    // if (this.state.token) {
    // }
    // create Agora client
    this.client.setClientRole(this.state.role);

    if (this.state.role === 'audience') {
      // add event listener to play remote tracks when remote user publishs.
      this.client.on('user-published', handleUserPublished);
      this.client.on('user-unpublished', handleUserUnpublished);
    }

    // join the channel
    this.state.uid = await this.client.join(
      this.state.appid,
      this.state.channel,
      this.state.token || null
    );

    if (this.state.role === 'host') {
      this.setState({ isActive: true });
      // create local audio and video tracks
      this.state.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.state.videoTrack = await AgoraRTC.createCameraVideoTrack();
      // play local video track
      this.state.videoTrack.play('local-player');
      // $('#local-player-name').text(`localTrack(${options.uid})`);
      // publish local tracks to channel
      await this.client.publish(this.state.videoTrack, this.state.audioTrack);
      console.log('publish success');
    }

    async function leave() {
      // for (trackName in localTracks) {
      //   var track = localTracks[trackName];
      //   if (track) {
      //     track.stop();
      //     track.close();
      //     localTracks[trackName] = undefined;
      //   }
      // }
      // // remove remote users and player views
      // remoteUsers = {};
      // $('#remote-playerlist').html('');
      // // leave the channel
      // await client.leave();
      // $('#local-player-name').text('');
      // $('#host-join').attr('disabled', false);
      // $('#audience-join').attr('disabled', false);
      // $('#leave').attr('disabled', true);
      // console.log('client leaves channel success');
    }

    async function subscribe(user, mediaType) {
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
      // if (mediaType === 'audio') {
      //   user.audioTrack.play();
      // }
    }

    function handleUserPublished(user, mediaType) {
      const id = user.uid;
      state.remoteUsers[id] = user;
      subscribe(user, mediaType);
    }

    function handleUserUnpublished(user) {
      const id = user.uid;
      delete state.remoteUsers[id];
      // $(`#player-wrapper-${id}`).remove();
    }
  }
  render() {
    return (
      <div className="streamContainer" id="local-player">
        {/* <UserFrame /> */}
      </div>
    );
  }
}
