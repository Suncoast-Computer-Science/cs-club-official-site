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
    try {
      const test_cases = snapshot.val()[snapshot.val().length - 1].testcases
      res.send(test_cases) // We can send all testcases and not even check if they're done because the post request can unpdate the testcases as pending
    } catch {
      res.status(400).send('User does not have any submissions for this problem')
    }

  })
})

exports.api = functions.https.onRequest(app)
