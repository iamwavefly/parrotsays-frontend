const axios = require('axios');

let HEADERS = {
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin',
  'Content-Type': 'application/json', //optional
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '8640',
};

//This solves the "No ‘Access-Control-Allow-Origin’ header is present on the requested resource."

HEADERS['Access-Control-Allow-Origin'] = '*';
HEADERS['Vary'] = 'Origin';

export function handler(event, context, callback) {
  const { channel, uid, resource, mode, token } = JSON.parse(event.body);
  console.log('queryStringParameters', event.queryStringParameters);
  const customerKey = 'e88a7b8bdb7446aebd8713f68460546f';
  // Customer secret
  const customerSecret = '2b06a55b23ee4ca995a5e5df75b0fee0';
  // APPID
  const AppId = '306d86f1ec2644c3affab320daef132c';

  const Authorization = `Basic ${Buffer.from(
    `${customerKey}:${customerSecret}`
  ).toString('base64')}`;

  const send = (msgs) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(msgs),
      HEADERS,
    });
  };

  const url = `https://api.agora.io/v1/apps/${AppId}/cloud_recording/resourceid/${resource}/mode/${mode}/start`;

  const startCloudRecord = () => {
    axios
      .post(
        url,
        {
          cname: channel,
          uid: uid,
          clientRequest: {
            recordingConfig: {
              maxIdleTime: 400,
              streamTypes: 2,
              channelType: 1,
              videoStreamType: 0,
              transcodingConfig: {
                height: 640,
                width: 360,
                bitrate: 500,
                fps: 15,
                mixedVideoLayout: 1,
                backgroundColor: '#FFFFFF',
                backgroundImage: 'https://i.ibb.co/98y9ZSN/parrotsays.jpg',
              },
            },
            recordingFileConfig: {
              avFileType: ['hls', 'mp4'],
            },
            storageConfig: {
              vendor: 1,
              region: 5,
              bucket: 'parrotrelease',
              accessKey: 'AKIAZJZ4IZ3VYZBRLFFY',
              secretKey: '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',
              fileNamePrefix: ['liveStream', 'videos'],
            },
          },
        },
        { headers: { Authorization } }
      )
      .then((data) => {
        console.log(data.data);
        send(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  event.httpMethod === 'POST' && startCloudRecord();
}
