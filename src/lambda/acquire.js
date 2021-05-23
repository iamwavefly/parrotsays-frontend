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
  const { channel, uid } = JSON.parse(event.body);
  console.log('queryStringParameters', event.queryStringParameters);
  const customerKey = 'e88a7b8bdb7446aebd8713f68460546f';
  // Customer secret
  const customerSecret = '2b06a55b23ee4ca995a5e5df75b0fee0';
  // APPID
  const AppId = '306d86f1ec2644c3affab320daef132c';

  const Authorization = `Basic ${Buffer.from(
    `${customerKey}:${customerSecret}`
  ).toString('base64')}`;

  const url = `https://api.agora.io/v1/apps/${AppId}/cloud_recording/acquire`;

  const send = (msgs) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(msgs),
      HEADERS,
    });
  };

  const getResourceId = () => {
    axios
      .post(
        url,
        {
          cname: channel,
          uid: uid,
          clientRequest: {
            resourceExpiredHour: 24,
          },
        },
        { headers: { Authorization } }
      )
      .then((data) => {
        console.log(data.data.resourceId);
        send(data.data.resourceId);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  event.httpMethod === 'POST' && getResourceId();
}
