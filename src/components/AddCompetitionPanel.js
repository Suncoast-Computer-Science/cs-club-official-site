import { useRef, useState, useEffect } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { ref, set, get, child } from "firebase/database";
import DateRangePicker from "react-bootstrap-daterangepicker";

import { useAuth } from "../api/AuthContext";

// TODO: add testing to ensure that duplicate panels don't get added
export default function AddCompetitionPanel() {
  const { db } = useAuth();
  const dbRef = ref(db);

  const dateTimeRef = useRef();
  const [competitionDates, setCompetitionDates] = useState({});
  const nameRef = useRef();
  const idRef = useRef();
  const aboutRef = useRef();
  const inPersonRef = useRef();
  const [problemsList, setProblemsList] = useState([]);
  const problemDropdownRef = useRef();
  const [problems, setProblems] = useState([]);

  const onCompetitionTimeChange = (_, { startDate, endDate }) => {
    setCompetitionDates({
      startDate: Date.parse(startDate._d),
      endDate: Date.parse(endDate._d),
    });
  };

  useEffect(() => {
    get(child(dbRef, "problemsList/")).then((snapshot) => {
      setProblemsList(Object.keys(snapshot.val()));
    });
  }, [dbRef]);

  const submit = async (e) => {
    e.preventDefault();
    await set(child(dbRef, `competitions/${idRef.current.value}`), {
      about: aboutRef.current.value,
      name: nameRef.current.value,
      "start-date": competitionDates.startDate,
      "end-date": competitionDates.endDate,
      "in-person": inPersonRef.current.checked,
      "problems": problems
    });
  };

  return (
    <Card className="m-2 border-primary">
      <Card.Body>
        <Card.Title>Add Competition</Card.Title>
        <Card.Text></Card.Text>
        <Form>
          <div className="row">
            <Form.Group className="mb-3 col">
              <Form.Label>Competition Name:</Form.Label>
              <Form.Control
                placeholder="Enter Competition Name"
                ref={nameRef}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Competition Id:</Form.Label>
              <Form.Control placeholder="competition-id" ref={idRef} />
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>About:</Form.Label>
            <Form.Control
              placeholder="Description about your competition"
              ref={aboutRef}
            />
          </Form.Group>
          <Form.Group className="mb-3 col">
            <Container>
              <Row>
                <Col>
                  <DateRangePicker
                    initialSettings={{ timePicker: true }}
                    ref={dateTimeRef}
                    onApply={onCompetitionTimeChange}
                  >
                    <Button>Set</Button>
                  </DateRangePicker>
                </Col>
                <Col>
                  <Form.Control disabled value={competitionDates.startDate} />
                </Col>
                <Col>
                  <Form.Control disabled value={competitionDates.endDate} />
                </Col>
              </Row>
            </Container>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Add Problem:</Form.Label>
            <Form.Select ref={problemDropdownRef}>
              {problemsList.map((id, index) => (
                <option key={index} value={id}>
                  {id}
                </option>
              ))}
            </Form.Select>
            <Form.Label>{problems.join()}</Form.Label>
          </Form.Group>
          <Form.Group>
            <Button
              onClick={() =>
                setProblems([...problems, problemDropdownRef.current.value])
              }
            >
              Add Problem
            </Button>
            <Button onClick={() => setProblems([])}>Clear Problems</Button>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="In Person?" ref={inPersonRef} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={submit}>
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
