import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import { Modal, Table } from 'react-bootstrap';
import MonacoEditor from 'react-monaco-editor';

import Header from '../components/Header'
import { testSubmission, gradeSubmission, getLastSubmission } from '../api/BackendRequests'

import ProblemHomepageHeader from '../components/ProblemHomepageHeader'

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
      // console.log(currentUser)
      const response = await gradeSubmission(userCode, languageId, competitionId, problemId, currentUser.uid) // Returns an array with all the test case Results
      // setTestResponse(response.toString()) // Do something else
      setLastSubmissionData(lastSubmissionData.data)
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Header />
      <ProblemHomepageHeader problemData={problemData} />
      <div class="container-fluid p-4" >
        <div class="row">
          <div class="col-4" style={{ height: "100%", overflowY: "hidden" }}>
            {problemData ?
              <>
                <h2>Problem Statement</h2>
                <p>{problemData.statement}</p>

                <h2>Input</h2>
                <p>{problemData.input}</p>

                <h2>Output</h2>
                <p>{problemData.output}</p>

                {/*<p>{JSON.stringify(problemData)}</p> will show you everything available*/}
                <h3>Samples</h3>
                {problemData.samples.map(({ input, output, explanation }, i) =>
                  <>
                    <div class="card mb-2">
                      <h5 class="card-header">Sample #{i + 1}:</h5>
                      <div class="card-body container">
                        <div class="row">
                          <div class="col">
                            <p>Input: </p>
                            {input ?
                              <p class="card-text bg-dark text-light p-1">{input}</p>
                              :
                              <p><i>No Input!</i></p>
                            }
                          </div>
                          <div class="col">
                            <p>Output: </p>
                            <p class="card-text bg-dark text-light p-1">{output}</p>
                          </div>
                        </div>
                      </div>
                      {explanation ?
                        <>
                          <p>Explanation: {explanation}</p>
                        </> : <> </>}
                    </div>
                  </>)}

              </>
              :
              <> </>
            }

          </div>
          <div className=" col-8">
            <form>
              <div className="form-group row">
                <label className="col-sm-1 offset-sm-9 col-form-label">
                  Language:
                </label>
                <div className="col-sm-2">
                  <select className="form-control" value={languageId} onChange={(e) => setLanguageId(e.target.value)}>
                    <option selected value="71">Python</option>
                    <option selected value="76">C++</option>
                    <option selected value="50">C</option>
                    <option selected value="62">Java</option>
                  </select>
                </div>
              </div>
            </form>
            <MonacoEditor
              width="100%"
              height="600"
              theme="vs-dark"
              language='javascript'
              value={userCode}
              onChange={(e) => setUserCode(e)}
            />
            {!isProcessing ?
              <form className="form-group row" style={{ overflowY: "hidden" }}>
                <div className="col-sm-4">
                  <p className="col-form-label">Test Input: </p>
                  <textarea className="form-control" style={{ height: "100%" }} ref={sampleInputRef}></textarea>
                </div>
                <div className="col-sm-4">
                  <p className="col-form-label col-sm-2">Output: </p>
                  <textarea className="form-control" style={{ height: "100%" }} value={testResponse} readonly></textarea>
                </div>
                <div className="col-sm-4">
                  <div className="col-form-label">
                    &nbsp;
                  </div>
                  <div className="py-1">
                    <button className="btn btn-secondary" onClick={onTestSubmit}>Try Sample</button>
                  </div>
                  <div className="py-1">
                    {currentUser ?
                      <button className="btn btn-primary" onClick={onGradeSubmit}>Submit for Grading</button>
                      :
                      <button className="btn btn-primary" disabled> Sign in to Submit! </button>
                    }
                  </div>
                  <div className="py-1">
                    <button
                      className="btn btn-success"
                      onClick={handleShow}
                    >
                      Open Submission Results
                    </button>
                  </div>
                </div>
              </form>
              :
              <p> loading </p>
            }
          </div>
        </div>
      </div>
      <Modal show={showSubmissionResults} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Last Submission Results:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser?.uid && lastSubmissionData ?
            <>
              {typeof (lastSubmissionData) == 'string' ?
                <>No past submissions!</>
                :
                <>
                  <thead>
                    <tr>
                      {lastSubmissionData.map((_, index) => (
                        <th key={index}>{index}</th>
                      ))} </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {lastSubmissionData.map((result, index) => (
                        <td key={index}>{result}</td>
                      ))}
                    </tr>
                  </tbody>
                </>
              }
            </>
            :
            <>Sign in to view Submission Results!</>
          }
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
