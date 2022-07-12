const express = require('express');
const app = express();
const port = 3000;
const serviceAccountKey = "[fcm service key.json]";
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var admin = require('firebase-admin');
var serviceAccount = require(serviceAccountKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.route('/message').post(function (req, res) {
  console.log(req.body);
  const { body } = req;
  const { notification, token, data } = body;
  const { title, message } = data;

  var json = {
    token,
    notification,
    data: {
      title,
      message,
    },
  };

  SendMessage(json)
    .then(function (response) {
      res.send(response);
    })
    .catch(function (error) {
      res.send(error);
    });
});

function SendMessage(message) {
  return new Promise(function (resolve, reject) {
    admin.messaging().send(message)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});