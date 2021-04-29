import React, { Component } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import Axios from 'axios';
import UserFrame from '../Components/pages/liveScream/UserFrame';
import '../styles/stream.css';

export default class Stream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      // For the local audio and video tracks.
      localAudioTrack: null,
      localVideoTrack: null,
      appid: '306d86f1ec2644c3affab320daef132c',
      token: '',
      channel: this.props.channel,
      role: this.props.role,
      uid: '',
      username: this.props.username,
      remoteUsers: {},
      isActive: false,
      videoTrackEnabled: true,
      audioTrackEnabled: true,
    };
  }

  async componentDidMount() {
    if (this.props.channel) {
      await Axios.post('http://localhost:4000/rtctoken', {
        channel: this.props.channel,
        isPublisher: true,
      }).then((res) =>
        this.setState({ token: res.data.token, uid: res.data.uid })
      );
      console.log(this.state.token);
    } else {
      console.log('no username');
    }
    // ----------AGORA RTC INIT-----------
    if (this.state.token) {
      const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });

      var rtc = {
        // For the local client.
      };
      var options = {
        // Pass your app ID here.
        appId: this.state.appid,
        // Set the channel name.
        channel: this.state.channel,
        // Pass a token if your project enables the App Certificate.
        token: this.state.token,
        // Set the user role in the channel.
        role: this.state.role,
      };
      const startBasicCall = async () => {
        this.state.client = AgoraRTC.createClient({
          mode: 'rtc',
          codec: 'vp8',
        });
        // Set role as "host" or "audience".
        client.setClientRole(this.state.role);
        this.state.uid = await this.state.client.join(
          this.state.appid,
          this.state.username,
          this.state.token,
          null
        );
        // Create an audio track from the audio sampled by a microphone.
        this.state.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        // Create a video track from the video captured by a camera.
        this.state.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        // Publish the local audio and video tracks to the channel.
        await this.state.client.publish([
          this.state.localAudioTrack,
          this.state.localVideoTrack,
        ]);

        console.log('publish success!');

        this.state.client.on('user-published', async (user, mediaType) => {
          // Subscribe to a remote user.
          await this.state.client.subscribe(user, mediaType);
          console.log('subscribe success');

          // If the subscribed track is video.
          if (mediaType === 'video') {
            // Get `RemoteVideoTrack` in the `user` object.
            const container = document.getElementById('local-player');
            const remoteVideoTrack = user.videoTrack;
            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            const playerContainer = document.createElement('div');
            // Specify the ID of the DIV container. You can use the `uid` of the remote user.
            playerContainer.id = user.uid.toString();
            playerContainer.style.width = '640px';
            playerContainer.style.height = '480px';
            container.appendChild(playerContainer);
            // Play the remote video track.
            // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
            remoteVideoTrack.play(playerContainer);

            // Or just pass the ID of the DIV container.
            // remoteVideoTrack.play(playerContainer.id);
          }

          // If the subscribed track is audio.
          if (mediaType === 'audio') {
            // Get `RemoteAudioTrack` in the `user` object.
            const remoteAudioTrack = user.audioTrack;
            // Play the audio track. No need to pass any DOM element.
            remoteAudioTrack.play();
          }
        });
        this.state.client.on('user-unpublished', (user) => {
          // Get the dynamically created DIV container.
          const playerContainer = document.getElementById(user.uid);
          // Destroy the container.
          playerContainer.remove();
        });
        async function leaveCall() {
          // Destroy the local audio and video tracks.
          rtc.localAudioTrack.close();
          rtc.localVideoTrack.close();

          // Traverse all remote users.
          rtc.client.remoteUsers.forEach((user) => {
            // Destroy the dynamically created DIV container.
            const playerContainer = document.getElementById(user.uid);
            playerContainer && playerContainer.remove();
          });

          // Leave the channel.
          await rtc.client.leave();
        }
      };

      startBasicCall();
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
