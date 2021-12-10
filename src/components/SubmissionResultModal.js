import { Modal, Table, Button } from 'react-bootstrap';

import { useAuth } from '../api/AuthContext'

export default function SubmissionResultsModal({ show, handleClose, lastSubmissionData }) {
  const { currentUser } = useAuth()
  return (
    <Modal show={show} onHide={handleClose} size="lg">
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
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
