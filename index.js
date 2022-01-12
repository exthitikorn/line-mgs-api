'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'f8I35YYsQE/VJTPh+BVuY6bVN/YPXB3gAnpgVFiBxoAvbLNb8ctU5IBpsExojtN81lHCFfGetb/IXm16VjGh2dvIaY5sXeguLarYyIPIQUHmChekd8dTQ9alZ8tOENqnrYrQey6D8/hQGMy68cVrCwdB04t89/1O/w1cDnyilFU=',
  channelSecret: '8e00bcf544b02de3a9dba0b8361bbd55',
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
  } else if (event.message.type === "message" || event.message.text === 'Hello'){
    const playload = {
      type: "text",
      text: "Hello From Heroku Server."
    };
    return client.replyMessage(event.replyToken, playload);
  }

  // create a echoing text message
  // const echo = { type: 'text', text: event.message.text };

  // use reply API
  // return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
