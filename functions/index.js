const functions = require('firebase-functions')
require('dotenv').config({ path: '../.env' })
const express = require('express')
const app = express()
app.use(express.json())

const admin = require('firebase-admin');

// Follow instructions to set up admin credentials:
// https://firebase.google.com/docs/functions/local-emulator#set_up_admin_credentials_optional
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // TODO: ADD YOUR DATABASE URL
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
});

// Can't use authentication in https requests just yet as I haven't figured out how to properly configure it with emulators

// const authenticate = async (req, res, next) => {
//   if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
//     res.status(403).send('Unauthorized');
//     return;
//   }
//   const idToken = req.headers.authorization.split('Bearer ')[1];
//   try {
//     const decodedIdToken = await admin.auth().verifyIdToken(idToken);
//     req.user = decodedIdToken;
//     next();
//     return;
//   } catch (e) {
//     console.log(idToken)
//     console.log(e)
//     res.status(403).send('Unauthorized');
//     return;
//   }
// };
// app.use(authenticate);

// GET /api/submission/:competitionId/:problemId
// Returns latest results for a user's last submission of a competition problem
app.get('/submission/:competitionId/:problemId/:userId', (req, res) => {
  const { competitionId, problemId, userId } = req.params
  output = {}
  admin.database().ref(`submissions/${competitionId}/${problemId}/${userId}`).once('value', snapshot => {
    const testcases = snapshot.val()[snapshot.val().length - 1].testcases
    for (let i in testcases) {
      output[i] = testcases[i]
    }
    output = testcases
    res.send(output)
  })
})

exports.api = functions.https.onRequest(app)
