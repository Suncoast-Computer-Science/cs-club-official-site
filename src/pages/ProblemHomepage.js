import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import { Modal, Table } from 'react-bootstrap';
import MonacoEditor from 'react-monaco-editor';

import Header from '../components/Header'
import { testSubmission, gradeSubmission, getLastSubmission } from '../api/BackendRequests'

import ProblemHomepageHeader from '../components/ProblemHomepageHeader'
import SubmissionResultModal from '../components/SubmissionResultModal'
import Editor from '../components/Editor'
import ProblemSubmissionButtons from '../components/ProblemSubmissionButtons.js'
import ProblemDescription from '../components/ProblemDescription'
import ProblemLanguageSelector from '../components/ProblemLanguageSelector'

export default function ProblemHomepage() {
  const { db, currentUser } = useAuth()
  const { competitionId, problemId } = useParams()

  const sampleInputRef = useRef();

  const [problemData, setProblemData] = useState(null)
  const [testResponse, setTestResponse] = useState("")
  const [languageId, setLanguageId] = useState(71)
  const [userCode, setUserCode] = useState("print('bruh')")
  const [lastSubmissionData, setLastSubmissionData] = useState(null)
  const [showSubmissionResults, setShowSubmissionResults] = useState(false)


  const handleClose = () => setShowSubmissionResults(false)
  const handleShow = async (e) => {
    e.preventDefault()
    setShowSubmissionResults(true)
    if (currentUser?.uid) {
      const lastSubmissionRequest = await getLastSubmission(competitionId, problemId, currentUser.uid)
      // setTestResponse(lastSubmissionRequest.data) // Gets you the last submission results in an array if there is a submission, or 'No Last Submission Found' if there is no last submission
      setLastSubmissionData(lastSubmissionRequest.data)
    }
  }

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
      // setTestResponse(lastSubmissionRequest.data) // Gets you the last submission results in an array if there is a submission, or 'No Last Submission Found' if there is no last submission
      setLastSubmissionData(lastSubmissionRequest.data)
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
      const response = await gradeSubmission(userCode, languageId, competitionId, problemId, currentUser.uid) // Returns an array with all the test case Results
      setLastSubmissionData(response.data)
      setIsProcessing(false)
      handleShow(e)
    }
  }

  return (
    <>
      <Header />
      <ProblemHomepageHeader problemData={problemData} />
      <div class="container-fluid p-4" >
        <div class="row">
          <ProblemDescription problemData={problemData} />
          <div className="col-8" style={{ overflow: "hidden" }} >
            <ProblemLanguageSelector languageId={languageId} setLanguageId={setLanguageId} />
            <Editor value={userCode} setUserCode={setUserCode} />
            <ProblemSubmissionButtons
              sampleInputRef={sampleInputRef}
              testResponse={testResponse}
              onTestSubmit={onTestSubmit}
              onGradeSubmit={onGradeSubmit}
              handleShow={handleShow}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
      <SubmissionResultModal show={showSubmissionResults} handleClose={handleClose} lastSubmissionData={lastSubmissionData} />
    </>
  )
}
