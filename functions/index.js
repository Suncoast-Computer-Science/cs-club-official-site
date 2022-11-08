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

	// Add participants to competition
	admin.database().ref(`participants/${competitionId}/${userId}`).set(true);

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

	//Get submissions
	const submissionsSnapshot = await admin
		.database()
		.ref(`submissions/${competitionId}/${problemId}/${userId}`)
		.once('value');

	let index = !!submissionsSnapshot.val()
		? submissionsSnapshot.val().length
		: 0;

	const submissionTime = Date.now();

	let newSubmission = {
		submission: submission,
		language: language,
		time: submissionTime,
		testcases: Array(testcases.length).fill('PENDING'),
	};

	await admin
		.database()
		.ref(`submissions/${competitionId}/${problemId}/${userId}`)
		.child(index)
		.set(newSubmission);

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

	// Adds 1 to the number of questions a user has solved for a competition
	if (countAccepted === results.length) {
		console.log('bruh');
		const questionSolvedCountRef = admin
			.database()
			.ref(`question-solved-count/${competitionId}/${userId}`);
		questionSolvedCountRef.get().then((snapshot) => {
			const newQuestionSolvedCount = snapshot.val() + 1;
			questionSolvedCountRef.set(newQuestionSolvedCount);
			admin
				.database()
				.ref(
					`ranking-user-data/${competitionId}/${userId}/question-solved-count/`
				)
				.set(newQuestionSolvedCount);
		});
	} else {
		admin
			.database()
			.ref(
				`ranking-user-data/${competitionId}/${userId}/question-solved-count/`
			)
			.set(0);
	}

	const incorrectAttemptsCountRef = admin
		.database()
		.ref(`incorrect-attempts-count/${competitionId}/${problemId}/${userId}`);

	const getIncorrectAttemptsCount = async () => {
		let timesIncorrectSnapshot = await incorrectAttemptsCountRef.get();
		let timesIncorrect = 0;
		if (!timesIncorrectSnapshot.exists()) {
			timesIncorrect = 1;
		}

		return timesIncorrect;
	};

	admin
		.database()
		.ref(`submissions/${competitionId}/${problemId}/${userId}`)
		.child(index)
		.set(newSubmission);

	const competitionSnapshot = await admin
		.database()
		.ref(`competitions/${competitionId}`)
		.get();

	const competition = competitionSnapshot.val();
	let minutesElapsed =
		Math.floor((submissionTime - competition['start-date']) / 1000 / 1000) * 60;
	let deductionPerMinute = competition.deductions.minute;
	let incorrectAttemptsCount = await getIncorrectAttemptsCount();
	let deductionsPerIncorrectAttempt = competition.deductions.incorrect;

	admin
		.database()
		.ref(`incorrect-attempts-count/${competitionId}/${problemId}/${userId}`)
		.set(incorrectAttemptsCount + 1);

	const newDeductions =
		minutesElapsed * deductionPerMinute +
		(incorrectAttemptsCount + 1) * deductionsPerIncorrectAttempt;
	admin
		.database()
		.ref(`deductions/${competitionId}/${userId}/`)
		.set(newDeductions);

	admin
		.database()
		.ref(`ranking-user-data/${competitionId}/${userId}/deductions/`)
		.set(newDeductions);
	// res.send("tescase sent!")
	res.send(newSubmission); // We can do this, I don't have an issue with it as firebase functions last 60 seconds and we can wait tbh
});

app.get('/ranking/:competitionId/:userId/', async (req, res) => {
	const { competitionId, userId } = req.params;
	const cacheLiftime = 1000 * 60; // 1 minute
	let rank = 0;

	const cacheTimeRef = await admin
		.database()
		.ref(`rankings/time/${competitionId}/`)
		.get();
	const cacheTime = cacheTimeRef.val();
	const rankSnapshot = await admin
		.database()
		.ref(`rankings/cache/${competitionId}/${userId}/`)
		.get();
	rank = rankSnapshot.val();

	// If cached and cached time is before its lifetime ended
	if (cacheTime && cacheTime + cacheLiftime < Date.now() && rank) {
		// just keep rank as is
	} else {
		// Otherwise build the cache and return the current user's result
		let rankingUserDataRef = await admin
			.database()
			.ref(`ranking-user-data/${competitionId}`)
			.get();
		let rankingUserData = rankingUserDataRef.val();

		let rankings = [];

		for (let currentUserId of Object.keys(rankingUserData)) {
			rankings.push({
				userId: currentUserId,
				deductions: rankingUserData[currentUserId].deductions,
				'question-solved-count':
					rankingUserData[currentUserId]['question-solved-count'],
			});
		}

		rankings.sort(
			(a, b) =>
				-a['question-solved-count'] + b['question-solved-count'] ||
				a['deductions'] - b['deductions']
		);

		for (let currentRank in rankings) {
			let currentUserId = rankings[currentRank].userId;
			const newRank = parseInt(currentRank) + 1;
			admin
				.database()
				.ref(`rankings/cache/${competitionId}/${currentUserId}`)
				.set(newRank);
			if (currentUserId == userId) {
				rank = newRank;
			}
		}
	}

	admin.database().ref(`rankings/time/${competitionId}/`).set(Date.now());

	res.send(rank.toString());
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
