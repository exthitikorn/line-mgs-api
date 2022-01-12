'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'KyXKMPfTe1SuSfBq26+H8LivXi59Y6TSfCXd0XBliV3QSPzUAB9GBdIIhvthhUtmhFcjhOUJ0P3bZW4OVxVC94iREPXCEhhS+3Znq2bfUZlGsKmG/v3n3A1SMN+7ZFLOqzQeSKB9RQQivRi2pVDL4QdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'be23830146238e02ff08e00b18b769a2',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
