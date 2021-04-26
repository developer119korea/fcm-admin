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

app.route('/pushmessage').post(function (req, res) {
  console.log(req.body);
  var message = {
    token: req.body.to,
    notification: {
      title: req.body.notification.title,
      body: req.body.notification.body
    },
    data: {
      title: req.body.data.title,
      message: req.body.data.message,
    },
  };

  PushMessage(message)
    .then(function (response) {
      res.send(response);
    })
    .catch(function (error) {
      res.send(error);
    });
});

function PushMessage(message) {
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