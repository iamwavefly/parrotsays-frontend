import React, { Component } from 'react';
import AgoraRTC from 'agora-rtc-sdk';
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
    const tokenGen = async () => {
      await Axios.post('https://parrotsays-backend.herokuapp.com/rtctoken', {
        channel: this.props.channel,
        isPublisher: true,
      }).then((res) =>
        this.setState({ token: res.data.token, uid: res.data.uid })
      );
      console.log(this.state.token);
    };
    if (this.props.channel) {
      tokenGen();
    } else {
      console.log('no username');
    }
    // ----------AGORA RTC INIT-----------
    if (this.state.token) {
      let localVideoPlayer = document.getElementById('local-player');
      let audioControl = document.getElementById('audioControl');
      let videoControl = document.getElementById('videoControl');
      let endStreamControl = document.getElementById('endStreamControl');
      /**
       * Agora Broadcast Client
       */

      // Defaults
      let client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
      let mainStreamId;
      let cameraVideoProfile = '720p_6';
      let localStreams = {
        uid: '',
        camera: {
          camId: '',
          micId: '',
          stream: {},
        },
      };
      var devices = {
        cameras: [],
        mics: [],
      };
      // Initialise Agora CDN
      client.init(
        this.state.appid,
        () => {
          console.log('initialized');
        },
        function (err) {}
      );
      // Connect New People
      client.on('stream-added', function (evt) {
        var stream = evt.stream;
        client.subscribe(stream, function (err) {});
      });
      client.on('stream-subscribed', function (evt) {
        var remoteStream = evt.stream;
        var remoteId = remoteStream.getId();
        console.log('Subscribe remote stream successfully: ' + remoteId);
        if (localVideoPlayer.innerHTML === '') {
          mainStreamId = remoteId;
          remoteStream.play('local-player');
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

      // Join Channel
      const joinChannel = (channelName) => {
        // disableChannelBtn();
        let token = this.state.token;
        let userID = null;
        // It's a Host
        client.setClientRole(
          this.state.role,
          function () {},
          function (e) {}
        );
        // Track Stream
        client.join(
          token,
          channelName,
          userID,
          function (uid) {
            createCameraStream(uid, {});
            localStreams.uid = uid;
          },
          function (err) {}
        );
      };

      // Frontal Screen : Camera
      function createCameraStream(uid, deviceIds) {
        var localStream = AgoraRTC.createStream({
          streamID: uid,
          audio: true,
          video: true,
          screen: false,
        });
        localStream.setVideoProfile(cameraVideoProfile);
        localStream.on('accessAllowed', function () {
          if (devices.cameras.length === 0 && devices.mics.length === 0) {
            getCameraDevices();
            getMicDevices();
          }
        });
        // Show Host How They Look
        localStream.init(
          function () {
            localStream.play('local-player');
            // if (Object.keys(localStreams.camera.stream).length === 0) {
            // enableUiControls(localStream);
            // } else {
            // Reset Action Buttons
            // $('#mic-btn').prop('disabled', false);
            // $('#video-btn').prop('disabled', false);
            // $('#exit-btn').prop('disabled', false);
            // $('#mic-dropdown').prop('disabled', false);
            // $('#cam-dropdown').prop('disabled', false);
            // }
            client.publish(localStream, function (err) {});
            localStreams.camera.stream = localStream;
          },
          function (err) {}
        );
      }
      client.on('onTokenPrivilegeWillExpire', () => {
        tokenGen();
        //After requesting a new token
        client.renewToken(this.state.token);
      });
      client.on('onTokenPrivilegeDidExpire', () => {
        tokenGen();
        //After requesting a new token
        client.renewToken(this.state.token);
      });
      function changeStreamSource(deviceIndex, deviceType) {
        console.log('Switching stream sources for: ' + deviceType);
        var deviceId;
        var existingStream = false;

        if (deviceType === 'video') {
          deviceId = devices.cameras[deviceIndex].deviceId;
        }

        if (deviceType === 'audio') {
          deviceId = devices.mics[deviceIndex].deviceId;
        }

        localStreams.camera.stream.switchDevice(
          deviceType,
          deviceId,
          function () {
            console.log(
              'successfully switched to new device with id: ' +
                JSON.stringify(deviceId)
            );
            // set the active device ids
            if (deviceType === 'audio') {
              localStreams.camera.micId = deviceId;
            } else if (deviceType === 'video') {
              localStreams.camera.camId = deviceId;
            } else {
              console.log('unable to determine deviceType: ' + deviceType);
            }
          },
          function () {
            console.log(
              'failed to switch to new device with id: ' +
                JSON.stringify(deviceId)
            );
          }
        );
      }

      // Get Device Info
      // Video Devices
      function getCameraDevices() {
        client.getCameras(function (cameras) {
          devices.cameras = cameras;
          cameras.forEach(function (camera, i) {
            // var name = camera.label.split('(')[0];
            // var optionId = 'camera_' + i;
            var deviceId = camera.deviceId;
            if (i === 0 && localStreams.camera.camId === '') {
              localStreams.camera.camId = deviceId;
            }
            // $('#camera-list').append(
            //   '<a class="dropdown-item" id="' + optionId + '">' + name + '</a>'
            // );
          });
          // $('#camera-list a').click(function (event) {
          //   var index = event.target.id.split('_')[1];
          //   changeStreamSource(index, 'video');
          // });
        });
      }
      // Audio Devices
      function getMicDevices() {
        client.getRecordingDevices(function (mics) {
          devices.mics = mics;
          mics.forEach(function (mic, i) {
            var name = mic.label.split('(')[0];
            var optionId = 'mic_' + i;
            var deviceId = mic.deviceId;
            if (i === 0 && localStreams.camera.micId === '') {
              localStreams.camera.micId = deviceId;
            }
            if (name.split('Default - ')[1] !== undefined) {
              name = '[Default Device]';
            }
            // $('#mic-list').append(
            //   '<a class="dropdown-item" id="' + optionId + '">' + name + '</a>'
            // );
          });
          // $('#mic-list a').click(function (event) {
          //   var index = event.target.id.split('_')[1];
          //   changeStreamSource(index, 'audio');
          // });
        });
      }
      audioControl.addEventListener('click', () => {
        if (this.state.audioTrackEnabled) {
          console.log('audio mute');
          localStreams.camera.stream.muteAudio();
          this.setState({ audioTrackEnabled: false });
        } else {
          this.setState({ audioTrackEnabled: true });
          localStreams.camera.stream.unmuteAudio();
        }
      });
      videoControl.addEventListener('click', () => {
        if (this.state.videoTrackEnabled) {
          localStreams.camera.stream.muteVideo();
          this.setState({ videoTrackEnabled: false });
          console.log('video mute');
        } else {
          this.setState({ videoTrackEnabled: true });
          localStreams.camera.stream.unmuteVideo();
        }
      });
      endStreamControl.addEventListener('click', async () => {
        await client.leave(() => {
          localStreams.camera.stream.stop();
          localStreams.camera.stream.close();
          client.unpublish(localStreams.camera.stream);
          window.location = 'https://parrotsays.com/';
        });
      });
      // endStreamControl;
      joinChannel(this.state.channel);
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
