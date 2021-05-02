function joinChannelAsScreenShare() {
  var token = generateToken();
  var userID = null; // set to null to auto generate uid on successfull connection
  screenClient.join(
    token,
    channelName,
    userID,
    function (uid) {
      localStreams.screen.id = uid; // keep track of the uid of the screen stream.

      // Create the stream for screen sharing.
      var screenStream = AgoraRTC.createStream({
        streamID: uid,
        audio: false, // Set the audio attribute as false to avoid any echo during the call.
        video: false,
        screen: true, // screen stream
        extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg', // Google Chrome:
        mediaSource: 'screen', // Firefox: 'screen', 'application', 'window' (select one)
      });
      screenStream.setScreenProfile(screenVideoProfile); // set the profile of the screen
      screenStream.init(
        function () {
          console.log('getScreen successful');
          localStreams.screen.stream = screenStream; // keep track of the screen stream
          $('#screen-share-btn').prop('disabled', false); // enable button
          screenClient.publish(screenStream, function (err) {
            console.log('[ERROR] : publish screen stream error: ' + err);
          });
        },
        function (err) {
          console.log('[ERROR] : getScreen failed', err);
          localStreams.screen.id = ''; // reset screen stream id
          localStreams.screen.stream = {}; // reset the screen stream
          screenShareActive = false; // resest screenShare
          toggleScreenShareBtn(); // toggle the button icon back (will appear disabled)
        }
      );
    },
    function (err) {
      console.log('[ERROR] : join channel as screen-share failed', err);
    }
  );

  screenClient.on('stream-published', function (evt) {
    console.log('Publish screen stream successfully');
    localStreams.camera.stream.disableVideo(); // disable the local video stream (will send a mute signal)
    localStreams.camera.stream.stop(); // stop playing the local stream
    // TODO: add logic to swap main video feed back from container
    remoteStreams[mainStreamId].stop(); // stop the main video stream playback
    addRemoteStreamMiniView(remoteStreams[mainStreamId]); // send the main video stream to a container
    // localStreams.screen.stream.play('full-screen-video'); // play the screen share as full-screen-video (vortext effect?)
    $('#video-btn').prop('disabled', true); // disable the video button (as cameara video stream is disabled)
  });

  screenClient.on('stopScreenSharing', function (evt) {
    console.log('screen sharing stopped', err);
  });
}
