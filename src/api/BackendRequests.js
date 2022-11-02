const axios = require('axios');

// Gets the status of a problem
export const testSubmission = async (submission, language, stdin) => {
	const res = await axios.post(
		process.env.REACT_APP_FIREBASE_FUNCTION_ENDPOINT + '/test',
		{
			submission,
			language,
			stdin,
		}
	);
	return res.data;
};

// Sends submission for a competition problem and returns data
export const gradeSubmission = async (
	submission,
	language,
	competitionId,
	problemId,
	userId
) => {
	const res = await axios.post(
		process.env.REACT_APP_FIREBASE_FUNCTION_ENDPOINT +
			`/submission/${competitionId}/${problemId}/${userId}`,
		{
			submission,
			language,
		}
	);
	return res.data;
};

// Queries result for competition problem
export const getLastSubmission = async (competitionId, problemId, userId) => {
	const res = await axios.get(
		process.env.REACT_APP_FIREBASE_FUNCTION_ENDPOINT +
			`/submission/${competitionId}/${problemId}/${userId}`
	);
	return res;
};
