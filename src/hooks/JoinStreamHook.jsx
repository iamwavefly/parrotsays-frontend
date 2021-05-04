import React, { Component } from 'react';
import Axios from 'axios';
import AgoraRTC from 'agora-rtc-sdk';
import UserFrame from '../Components/pages/liveScream/UserFrame';

export default class JoinStreamHook extends Component {
  constructor(props) {
    super(props);
    let params = new URLSearchParams(window.location.search);
    this.state = {
      client: null,
      // For the local audio and video tracks.
      localAudioTrack: null,
      localVideoTrack: null,
      appid: '306d86f1ec2644c3affab320daef132c',
      token: '',
      channel: params?.get('user_id'),
      role: 'audience',
      uid: '',
      username: params?.get('username'),
      remoteUsers: {},
      isActive: false,
      videoTrackEnabled: true,
      audioTrackEnabled: true,
    };
  }

  async componentDidMount() {
    if (this.state.channel) {
      await Axios.post('https://parrotsays-backend.herokuapp.com/rtctoken', {
        channel: this.state.channel,
        isPublisher: true,
      }).then((res) =>
        this.setState({ token: res.data.token, uid: res.data.uid })
      );
    }
    if (this.state.token) {
      let client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
      let localVideoPlayer = document.getElementById('local-player');
      let mainStreamId = '';

      // Initialise Agora CDN
      function initClientAndJoinChannel(agoraAppId, channelName) {
        client.init(
          agoraAppId,
          function () {},
          function (err) {}
        );
      }
      initClientAndJoinChannel(this.state.appid, this.state.channel);

      // Publish Stream
      client.on('stream-published', function (evt) {});

      // Connect New People
      client.on('stream-added', function (evt) {
        var stream = evt.stream;
        client.subscribe(stream, function (err) {});
      });

      client.on('stream-subscribed', function (evt) {
        var remoteStream = evt.stream;
        var remoteId = remoteStream.getId();
        remoteStream.play('local-player');
        if (localVideoPlayer.innerHTML === '') {
          mainStreamId = remoteId;
        } else {
          // addRemoteStreamMiniView(remoteStream);
        }
      });

      // Stop Stream
      client.on('stream-removed', function (evt) {
        var stream = evt.stream;
        stream.stop();
        stream.close();
      });

      // Stop Stream When Leaving
      client.on('peer-leave', function (evt) {
        evt.stream.stop();
      });

      // Join Channel
      const joinChannel = (channelName) => {
        // disableChannelBtn();
        // var token = generateToken();
        client.setClientRole(
          'audience',
          function () {},
          function (e) {}
        );
        client.join(
          this.state.token,
          channelName,
          0,
          function (uid) {
            console.log('UID', uid);
          },
          function (err) {}
        );
      };
      joinChannel(this.state.channel);
      // Leave Channel
      // function leaveChannel() {
      //   enableChannelBtn();
      //   client.leave(
      //     function () {
      //       $('#exit-btn').prop('disabled', true);
      //     },
      //     function (err) {}
      //   );
      // }
    }
  }
  render() {
    return (
      <div className="streamContainer">
        <UserFrame />
      </div>
    );
  }
}
