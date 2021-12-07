const axios = require('axios')
// Gets the status of a problem
export const testSubmission = async (submission, language, stdin) => {
  const res = await axios.post('http://localhost:5001/competition-submission-app/us-central1/api/test', {
    submission, language, stdin
  })
  return res.data
}

export const gradeSubmission = async (submission, language, competitionId, problemId, userId) => {
  const res = await axios.post(`http://localhost:5001/competition-submission-app/us-central1/api/submission/${competitionId}/${problemId}/${userId}`, {
    submission, language
  })
  return res.data
}
