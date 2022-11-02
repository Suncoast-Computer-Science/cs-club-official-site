if (process.env.NODE_ENV === 'production') {
	require('dotenv').config({ path: '.env.production.local' });
} else {
	require('dotenv').config({ path: '.env.local' });
}

const functions = require('firebase-functions');
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const admin = require('firebase-admin');

// Follow instructions to set up admin credentials:
// https://firebase.google.com/docs/functions/local-emulator#set_up_admin_credentials_optional
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	// TODO: ADD YOUR DATABASE URL
	databaseURL: process.env.FIREBASE_DATABASE_URL,
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

const getUserSubmissionTestcases = async (competitionId, problemId, userId) => {
	const snapshot = await admin
		.database()
		.ref(`submissions/${competitionId}/${problemId}/${userId}`)
		.once('value');
	try {
		return snapshot.val()[snapshot.val().length - 1]; // We can try this and if it fails we can assume there is no other submission
	} catch {
		return 'error';
	}
};

// GET /api/submission/:competitionId/:problemId
// Returns latest results for a user's last submission of a competition problem
app.get('/submission/:competitionId/:problemId/:userId', async (req, res) => {
	const { competitionId, problemId, userId } = req.params;
	const testcases = await getUserSubmissionTestcases(
		competitionId,
		problemId,
		userId
	);
	res.send(testcases);
});

const validateTestcase = (submission, language, stdin, stdout) => {
	return axios({
		method: 'POST',
		url: 'https://' + process.env.RAPIDAPI_ENDPOINT + '/submissions',
		params: {
			base64_endcoded: 'true',
			wait: 'true',
		},
		headers: {
			'content-type': 'application/json',
			'x-rapidapi-host': process.env.RAPIDAPI_ENDPOINT,
			'x-rapidapi-key': process.env.RAPIDAPI_KEY,
		},
		data: {
			language_id: language,
			source_code: submission,
			stdin,
			expected_output: stdout,
		},
	});
};

app.post('/submission/:competitionId/:problemId/:userId/', async (req, res) => {
	const { competitionId, problemId, userId } = req.params;
	const { submission, language } = req.body;

	// First make sure there are no pending submissions
	const userSubmissionResults = await getUserSubmissionTestcases(
		competitionId,
		problemId,
		userId
	);
	if (userSubmissionResults !== 'error') {
		let foundPending = false;
		for (let tc of userSubmissionResults.testcases) {
			if (tc === 'PENDING') {
				foundPending = true;
			}
		}
		if (foundPending) {
			res.send('Currently have pending submission');
			return;
		}
	}

	// Get tc data from firebase
	const testcaseSnapshot = await admin
		.database()
		.ref(`problems/${problemId}/testcases`)
		.once('value');
	const testcases = testcaseSnapshot.val();
	// TODO: handle error if no tc data from firebase
	const submissionsSnapshot = await admin
		.database()
		.ref(`submissions/${competitionId}/${problemId}/${userId}`)
		.once('value');
	let index = !!submissionsSnapshot.val()
		? submissionsSnapshot.val().length
		: 0;
	let newSubmission = {
		submission: submission,
		language: language,
		time: Date.now(),
		testcases: Array(testcases.length).fill('PENDING'),
	};
	await admin
		.database()
		.ref(`submissions/${competitionId}/${problemId}/${userId}`)
		.child(index)
		.set(newSubmission);

	// TODO: make it so that each test case will update independently
	let promises = testcases.map(({ input, output }) =>
		validateTestcase(submission, language, input, output)
	);
	const results = await Promise.all(promises);

	let countAccepted = 0;
	const testcaseResults = results.map((result) => {
		if (result.data.status.description === 'Accepted') countAccepted++;
		return result.data.status.description;
	});

	newSubmission = {
		...newSubmission,
		testcases: testcaseResults,
		passedAll: countAccepted === results.length,
	};
	await admin
		.database()
		.ref(`submissions/${competitionId}/${problemId}/${userId}`)
		.child(index)
		.set(newSubmission);

	// res.send("tescase sent!")
	res.send(newSubmission); // We can do this, I don't have an issue with it as firebase functions last 60 seconds and we can wait tbh
});

app.post('/test/', (req, res) => {
	const { submission, language, stdin } = req.body;

	axios({
		method: 'POST',
		url: 'https://' + process.env.RAPIDAPI_ENDPOINT + '/submissions',
		params: {
			base64_endcoded: 'true',
			wait: 'true',
		},
		headers: {
			'content-type': 'application/json',
			'x-rapidapi-host': process.env.RAPIDAPI_ENDPOINT,
			'x-rapidapi-key': process.env.RAPIDAPI_KEY,
		},
		data: {
			language_id: language,
			source_code: submission,
			stdin,
		},
	})
		.then((result) => {
			res.send(result.data);
		})
		.catch((error) => console.log(error));
});

app.use('/hello/', (req, res) => {
	res.send('hello!');
});

exports.api = functions.https.onRequest(app);
