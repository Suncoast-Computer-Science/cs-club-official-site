import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import MonacoEditor from 'react-monaco-editor';

import Header from '../components/Header'
import { testSubmission, gradeSubmission, getLastSubmission } from '../api/BackendRequests'

export default function ProblemHomepage() {
  const { db, currentUser } = useAuth()
  const { competitionId, problemId } = useParams()

  const sampleInputRef = useRef();

  const [problemData, setProblemData] = useState(null)
  const [userProblemData, setUserProblemData] = useState(null)
  const [testResponse, setTestResponse] = useState("")
  const [languageId, setLanguageId] = useState(71)
  const [userCode, setUserCode] = useState("print('bruh')")

  const [isProcessing, setIsProcessing] = useState(false) // TODO: Render differently if currently processing a request

  useEffect(async () => {
    // Get all the competition and problem data 
    const problemDataRequest = await db.ref(`problems/${problemId}/data`).once('value')
    setProblemData(problemDataRequest.val())
    // console.log(problemData)  // Check this line for Competition Details
    // console.log(userProblemData)  // Check this line to find a user's test cases
  }, [])

  useEffect(async () => {
    if (currentUser?.uid) {
      const lastSubmissionRequest = await getLastSubmission(competitionId, problemId, currentUser.uid)
      setTestResponse(lastSubmissionRequest.data) // Gets you the last submission results in an array if there is a submission, or 'No Last Submission Found' if there is no last submission
    }

  }, [problemData])

  const onTestSubmit = async (e) => {
    e.preventDefault()
    if (!isProcessing) {
      setIsProcessing(true)
      const response = await testSubmission(userCode, languageId, sampleInputRef.current.value)
      if (response.status.description === 'Accepted') {
        setTestResponse(response.stdout)
      } else {
        setTestResponse(response.status.description) // Do more stuff if there is an issue
      }
      setIsProcessing(false)
    }
  }

  const onGradeSubmit = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true)
      // console.log(currentUser)
      const response = await gradeSubmission(userCode, languageId, competitionId, problemId, currentUser.uid) // Returns an array with all the test case Results
      setTestResponse(response.toString()) // Do something else
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Header />
      {
        problemData ?
          <>
            {JSON.stringify(problemData)}
          </>
          :
          <>
            Loading
          </>
      }
      <form>
        <label>
          Pick Your language
          <select value={languageId} onChange={(e) => setLanguageId(e.target.value)}>
            <option selected value="71">Python</option>
            <option selected value="76">C++</option>
            <option selected value="50">C</option>
            <option selected value="62">Java</option>
          </select>
        </label>
      </form>
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={`console.log('bruh')`}
        language='javascript'
        value={userCode}
        onChange={(e) => setUserCode(e)}
      />

      {
        isProcessing ?
          "processing your request! If you're submitting a problem feel free to close this page and come back later"
          :
          < form >
            <p>Sample Input: </p>
            <textarea ref={sampleInputRef}></textarea>
            <textarea value={testResponse} disabled></textarea>
            <button onClick={onTestSubmit}>Try Sample</button>
            {currentUser ?
              <button onClick={onGradeSubmit}>Submit for Grading</button>
              :
              <button disabled> Sign in to Submit! </button>
            }
          </form>
      }
    </>
  )
}
