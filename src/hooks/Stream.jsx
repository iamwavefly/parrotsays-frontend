import React, { Component } from 'react';
import { connect } from 'react-redux';
import AgoraRTC from 'agora-rtc-sdk';
import Axios from 'axios';
import { shareScreen } from '../action/addMsg';
import UserFrame from '../Components/pages/liveScream/UserFrame';
import '../styles/stream.css';
import { FaThumbsDown } from 'react-icons/fa';

class Stream extends Component {
  constructor(props) {
    super(props);
    let params = new URLSearchParams(window.location.search);
    this.state = {
      client: null,
      // cloud storage
      resourceId: '',
      sid: '',
      // For the local audio and video tracks.
      screenShareActive: false,
      localAudioTrack: null,
      localVideoTrack: null,
      appid: '306d86f1ec2644c3affab320daef132c',
      token: '',
      channel: params?.get('user_id'),
      role: 'host',
      uid: '',
      username: params?.get('username'),
      remoteUsers: {},
      isActive: false,
      shareScreen: false,
      videoTrackEnabled: true,
      audioTrackEnabled: true,
    };
    this.shareScreen = this.shareScreen.bind(this);

    if (this.state.shareScreen === true) {
      alert('true');
      // initScreenShare(this.state.appid, this.state.channel);
    }
  }

  shareScreen = () => {
    console.log(this.props.share.share);
    this.setState({ shareScreen: this.props.share.share });
  };
  async componentDidMount() {
    if (this.state.username) {
      await Axios.post(
        'https://cors-anywhere.herokuapp.com/https://parrotsays-backend.herokuapp.com/rtctoken',
        {
          channel: this.state.username,
          isPublisher: true,
        }
      ).then((res) =>
        this.setState({ token: res.data.token, uid: res.data.uid })
      );
      console.log(this.state.token);
    } else {
      console.log('no channel provided');
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

      const userid = Number(123432);
      const getResourceId = async () => {
        await Axios.post('https://parrotsays-cloud.herokuapp.com/acquire', {
          channel: this.state.username,
          uid: `${userid}`,
        })
          .then((res) => {
            this.setState({ resourceId: res.data.resourceId });
            console.log(
              '-------------------get resource id------------------',
              res
            );
          })
          .catch((err) => console.log(err));
      };
      const startCloudRecord = async () => {
        await Axios.post('https://parrotsays-cloud.herokuapp.com/start', {
          channel: this.state.username,
          uid: `${userid}`,
          mode: 'mix',
          resource: this.state.resourceId,
          token: this.state.token,
        })
          .then((res) => {
            this.setState({
              resourceId: res.data.resourceId,
              sid: res.data.sid,
            });
            console.log('-------------start----------', res);
          })
          .catch((err) => console.log(err));
      };
      const queryCloudRecord = async () => {
        await Axios.post('https://parrotsays-cloud.herokuapp.com/query', {
          resource: this.state.resourceId,
          sid: this.state.sid,
          mode: 'mix',
        })
          .then((res) => {
            this.setState({
              resourceId: res.data.resourceId,
              sid: res.data.sid,
            });
            console.log('query-----------------------', res);
          })
          .catch((err) => console.log(err));
      };
      const stopCloudRecord = async () => {
        await Axios.post(
          'https://cors-anywhere.herokuapp.com/https://parrotsays-cloud.herokuapp.com/stop',
          {
            resource: this.state.resourceId,
            sid: this.state.sid,
            mode: 'mix',
            channel: this.state.channel,
            uid: `${userid}`,
          }
        )
          .then((res) => {
            this.setState({
              resourceId: res.data.resourceId,
              sid: res.data.sid,
            });
            console.log('stop-----------------------', res);
          })
          .catch((err) => console.log(err));
      };
      const acquireBtn = document
        .getElementById('acquire')
        .addEventListener('click', () => {
          getResourceId();
        });
      const startBtn = document
        .getElementById('start')
        .addEventListener('click', () => {
          startCloudRecord();
        });
      const queryBtn = document
        .getElementById('query')
        .addEventListener('click', () => {
          queryCloudRecord();
        });
      const stopBtn = document
        .getElementById('stop')
        .addEventListener('click', () => {
          console.log('clicked');
          stopCloudRecord();
        });

      // Defaults
      let client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
      let screenClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      let mainStreamId;
      // video profile settings // 640 × 480 @ 30fps  & 750kbs
      let screenVideoProfile = '1080p_2'; // 640 × 480 @ 30fps
      let cameraVideoProfile = '720p_6';
      let localStreams = {
        uid: '',
        camera: {
          camId: '',
          micId: '',
          stream: {},
        },
        screen: {
          id: '',
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
        console.log(
          'Subscribe remote stream successfully---------------------------------------: ' +
            remoteId
        );
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
      const joinChannel = async (channelName) => {
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
          async (uid) => {
            createCameraStream(uid, {});
            localStreams.uid = uid;
            this.setState({ uid: uid });
            localStreams.camera.id = uid;
          },
          function (err) {}
        );
      };
      // Frontal Screen : Camera
      const createCameraStream = (uid, deviceIds) => {
        var localStream = AgoraRTC.createStream({
          streamID: uid,
          audio: true,
          video: true,
          screen: this.state.shareScreen,
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
      };
      //screen sharing
      // SCREEN SHARING
      // SCREEN SHARING
      const initScreenShare = () => {
        screenClient.init(
          this.state.appid,
          () => {
            console.log('AgoraRTC screenClient initialized');
            joinChannelAsScreenShare();
            this.setState({ screenShareActive: true });
            // TODO: add logic to swap button
          },
          function (err) {
            console.log('[ERROR] : AgoraRTC screenClient init failed', err);
          }
        );
      };

      const joinChannelAsScreenShare = () => {
        let token = this.state.token;
        var userID = null; // set to null to auto generate uid on successfull connection
        screenClient.join(
          token,
          this.state.username,
          userID,
          (uid) => {
            localStreams.screen.id = uid; // keep track of the uid of the screen stream.

            // Create the stream for screen sharing.
            let screenStream = AgoraRTC.createStream({
              streamID: uid,
              audio: false, // Set the audio attribute as false to avoid any echo during the call.
              video: false,
              screen: true, // screen stream
              // extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg', // Google Chrome:
              mediaSource: 'screen', // Firefox: 'screen', 'application', 'window' (select one)
            });
            screenStream.setScreenProfile(screenVideoProfile); // set the profile of the screen
            screenStream.init(
              function () {
                console.log('getScreen successful');
                localStreams.screen.stream = screenStream; // keep track of the screen stream
                // $('#screen-share-btn').prop('disabled', false); // enable button
                screenClient.publish(screenStream, function (err) {
                  console.log('[ERROR] : publish screen stream error: ' + err);
                });
              },
              (err) => {
                console.log('[ERROR] : getScreen failed', err);
                localStreams.screen.id = ''; // reset screen stream id
                localStreams.screen.stream = {}; // reset the screen stream
                this.setState({ screenShareActive: false }); // resest screenShare
                // toggleScreenShareBtn(); // toggle the button icon back (will appear disabled)
              }
            );
          },
          function (err) {
            console.log('[ERROR] : join channel as screen-share failed', err);
          }
        );

        screenClient.on('stream-published', (evt) => {
          console.log('Publish screen stream successfully');
          localStreams.camera.stream.disableVideo(); // disable the local video stream (will send a mute signal)
          localStreams.camera.stream.stop(); // stop playing the local stream
          // TODO: add logic to swap main video feed back from container
          // remoteStreams[mainStreamId].stop(); // stop the main video stream playback
          // addRemoteStreamMiniView(remoteStreams[mainStreamId]); // send the main video stream to a container
          localStreams.screen.stream.play('local-player'); // play the screen share as full-screen-video (vortext effect?)
          // $('#video-btn').prop('disabled', true); // disable the video button (as cameara video stream is disabled)
        });

        screenClient.on('stopScreenSharing', function (evt) {
          console.log('screen sharing stopped');
        });
      };
      const stopScreenShare = () => {
        localStreams.screen.stream?.disableVideo(); // disable the local video stream (will send a mute signal)
        localStreams.screen.stream?.stop(); // stop playing the local stream
        localStreams.camera.stream?.enableVideo(); // enable the camera feed
        localStreams.camera.stream?.play('local-player'); // play the camera within the full-screen-video div
        // $("#video-btn").prop("disabled",false);
        screenClient.leave(
          () => {
            this.setState({ screenShareActive: false });
            console.log('screen client leaves channel');
            // $('#screen-share-btn').prop('disabled', false); // enable button
            screenClient.unpublish(localStreams.screen.stream); // unpublish the screen client
            localStreams.screen.stream.close(); // close the screen client stream
            localStreams.screen.id = ''; // reset the screen id
            localStreams.screen.stream = {}; // reset the stream obj
          },
          function (err) {
            console.log('client leave failed ', err); //error handling
          }
        );
      };

      // function changeStreamSource(deviceIndex, deviceType) {
      //   console.log('Switching stream sources for: ' + deviceType);
      //   var deviceId;
      //   var existingStream = false;

      //   if (deviceType === 'video') {
      //     deviceId = devices.cameras[deviceIndex].deviceId;
      //   }

      //   if (deviceType === 'audio') {
      //     deviceId = devices.mics[deviceIndex].deviceId;
      //   }

      //   localStreams.camera.stream.switchDevice(
      //     deviceType,
      //     deviceId,
      //     function () {
      //       console.log(
      //         'successfully switched to new device with id: ' +
      //           JSON.stringify(deviceId)
      //       );
      //       // set the active device ids
      //       if (deviceType === 'audio') {
      //         localStreams.camera.micId = deviceId;
      //       } else if (deviceType === 'video') {
      //         localStreams.camera.camId = deviceId;
      //       } else {
      //         console.log('unable to determine deviceType: ' + deviceType);
      //       }
      //     },
      //     function () {
      //       console.log(
      //         'failed to switch to new device with id: ' +
      //           JSON.stringify(deviceId)
      //       );
      //     }
      //   );
      // }
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
        client.leave(() => {
          localStreams.camera.stream.stop();
          localStreams.camera.stream.close();
          client.unpublish(localStreams.camera.stream);
          window.location = 'https://parrotsays.com/';
          this.stopCloudRecord();
        });
      });
      joinChannel(this.state.username);

      let shareScreenBtn = document.getElementById('shareScreenBtn');

      shareScreenBtn.addEventListener('click', () => {
        if (this.state.screenShareActive) {
          stopScreenShare();
        } else {
          initScreenShare(this.state.appid, this.state.username);
        }
      });
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
const mapStateToProps = (state) => {
  return {
    share: state.screenShare,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addNewMsg: (share) => {
      dispatch(shareScreen(share));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Stream);
