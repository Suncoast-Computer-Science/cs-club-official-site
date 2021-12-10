import { useAuth } from '../api/AuthContext'

export default function ProblemSubmissionButtons({ sampleInputRef, testResponse, onTestSubmit, onGradeSubmit, handleShow, isProcessing }) {
  const { currentUser } = useAuth()
  if (isProcessing) {
    return (
      <p>Loading</p>
    )
  } else {
    return (
      <form className="form-group row">
        <div className="col-sm-4">
          <p className="col-form-label">Test Input: </p>
          <textarea className="form-control" style={{ height: "100%" }} ref={sampleInputRef}></textarea>
        </div>
        <div className="col-sm-4">
          <p className="col-form-label col-sm-2">Output: </p>
          <textarea className="form-control" style={{ height: "100%" }} value={testResponse} readOnly></textarea>
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
    )
  }
}
