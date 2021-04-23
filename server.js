const express = require('express');
const app = express();
const port = 3000
const serviceAccountKey = "./developer119-fcm-firebase-adminsdk-phska-6d0cdfd529.json"
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var admin = require('firebase-admin');
var serviceAccount = require(serviceAccountKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.route('/push').post(function (req, res) {
  const toToken = req.body.to;
  const title = req.body.notification.title;
  const body = req.body.notification.body;
  PushMessage(toToken, title, body);
  res.send("");
});

function PushMessage(toToken, title, body) {
  var message = {
    notification: {
      "title": title,
      "body": body
    },
    token: toToken
  };

  admin.messaging().send(message)
    .then((response) => {
      return console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      return console.log('Error sending message:', error);
    });
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})