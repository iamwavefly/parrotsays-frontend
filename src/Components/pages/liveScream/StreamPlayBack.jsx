import React, { Component } from 'react';
import Player from 'react-hls-player';
import aws from 'aws-sdk';
import '../../../styles/streamplayback.css';

export default class StreamPlayBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoObjectKeys: [],
    };
  }
  async componentDidMount() {
    try {
      aws.config.setPromisesDependency();
      aws.config.update({
        accessKeyId: 'AKIAZJZ4IZ3VWCPO4KVP',
        secretAccessKey: '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',
        region: 'eu-west-2',
      });
      const s3 = new aws.S3();
      const response = await s3
        .listObjectsV2({
          Bucket: 'parrotrelease',
          Prefix: 'liveStream/videos',
        })
        .promise();
      const res = response.Contents.filter((key) => {
        return key.Key.endsWith('.m3u8');
      });
      this.setState({ videoObjectKeys: res });
    } catch (error) {
      console.error(error);
    }
  }
  render() {
    return (
      <div className="streamsContainer">
        <div className="header">
          <h2>Streams Playback</h2>
        </div>
        <div className="streams">
          {this.state.videoObjectKeys.length > 0 &&
            this.state.videoObjectKeys.slice(0, 10).map((keys) => {
              return (
                <Player
                  src={
                    'https://parrotrelease.s3.eu-west-2.amazonaws.com/' +
                    keys.Key
                  }
                  autoPlay={false}
                  controls={true}
                  width="100%"
                  height="auto"
                />
              );
            })}
        </div>
      </div>
    );
  }
}
