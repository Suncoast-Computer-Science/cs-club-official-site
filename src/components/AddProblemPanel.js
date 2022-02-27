import { useRef, useState } from "react";
import { Card, Button, Form, Nav, Container, Row, Col } from "react-bootstrap";
import { ref, set, child } from "firebase/database";

import { useAuth } from "../api/AuthContext";

// TODO: add testing to ensure that duplicate panels don't get added
export default function AddProblemPanel() {
  const { db } = useAuth();
  const dbRef = ref(db);

  const [samples, setSamples] = useState([]);
  const [testcases, setTestcases] = useState([]);

  const idRef = useRef(null);
  const nameRef = useRef(null);
  const authorRef = useRef(null);
  const statementRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const previewRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    await set(child(dbRef, `problemsList/${idRef.current.value}`), true)
    await set(child(dbRef, `problems/${idRef.current.value}`), {
      name: nameRef.current.value,
      author: authorRef.current.value,
      statement: statementRef.current.value,
      input: inputRef.current.value,
      output: outputRef.current.value,
      preview: previewRef.current.value,
      samples: samples,
      testcases: testcases,
    });
  };

  const SampleTestcaseForm = () => {
    return (
      <>
        <Form className="my-3">
          {samples.map(({ input, output }, index) => {
            return (
              <>
                <Form.Group>
                  <Form.Label className="h5 py-3">
                    Sample Test case #{index + 1}
                  </Form.Label>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Input</Form.Label>
                  <Form.Control
                    placeholder="Input"
                    onChange={(e) => {
                      let newSamples = samples;
                      newSamples[index].input = e.target.value;
                      setSamples(newSamples);
                    }}
                    value={input}
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Output</Form.Label>
                  <Form.Control
                    placeholder="Output"
                    onChange={(e) => {
                      let newSamples = samples;
                      newSamples[index].output = e.target.value;
                      setSamples(newSamples);
                    }}
                    value={output}
                  ></Form.Control>
                </Form.Group>
                <Button
                  className="my-3"
                  onClick={() => {
                    const newSamples = [
                      ...samples.slice(0, index),
                      ...samples.slice(index + 1),
                    ];
                    setSamples(newSamples);
                  }}
                  variant="danger"
                >
                  Remove Testcase
                </Button>
              </>
            );
          })}
        </Form>
        <Button onClick={() => setSamples([...samples, [{}]])}>
          Add Sample
        </Button>
      </>
    );
  };

  const TestcaseForm = () => {
    return (
      <>
        <Form className="my-3">
          {testcases.map(({ input, output }, index) => {
            return (
              <>
                <Form.Group>
                  <Form.Label className="h5 py-3">
                    Test case #{index + 1}
                  </Form.Label>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Input</Form.Label>
                  <Form.Control
                    placeholder="Input"
                    onChange={(e) => {
                      let newTestcase = testcases;
                      newTestcase[index].input = e.target.value;
                      setTestcases(newTestcase);
                    }}
                    value={input}
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Output</Form.Label>
                  <Form.Control
                    placeholder="Output"
                    onChange={(e) => {
                      let newTestcases = samples;
                      newTestcases[index].output = e.target.value;
                      setTestcases(newTestcases);
                    }}
                    value={output}
                  ></Form.Control>
                </Form.Group>
                <Button
                  className="my-3"
                  onClick={() => {
                    const newTestcases = [
                      ...testcases.slice(0, index),
                      ...testcases.slice(index + 1),
                    ];
                    setTestcases(newTestcases);
                  }}
                  variant="danger"
                >
                  Remove Testcase
                </Button>
              </>
            );
          })}
        </Form>
        <Button onClick={() => setTestcases([...testcases, [{}]])}>
          Add Sample
        </Button>
      </>
    );
  };

  return (
    <Card className="m-2 border-primary">
      <Card.Body>
        <Card.Title>Add Problem</Card.Title>
        <Card.Text></Card.Text>

        <Form>
          <Form.Group className="my-3 col">
            <Form.Label>Problem Name:</Form.Label>
            <Form.Control placeholder="Enter Problem Name" ref={nameRef} />
          </Form.Group>
          <Form.Group className="mb-3 col">
            <Form.Label>Problem ID:</Form.Label>
            <Form.Control placeholder="Enter Problem ID" ref={idRef} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author:</Form.Label>
            <Form.Control placeholder="Author" ref={authorRef} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Problem Preview</Form.Label>
            <Form.Control
              placeholder="Summarizes the problem in one line"
              ref={previewRef}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Problem Statement:</Form.Label>
            <Form.Control
              placeholder="Background information about the problem goes here"
              ref={statementRef}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Input Statement:</Form.Label>
            <Form.Control
              placeholder="How a submision will receive information"
              ref={inputRef}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Output Statement:</Form.Label>
            <Form.Control placeholder="What to output" ref={outputRef} />
          </Form.Group>
        </Form>
        <SampleTestcaseForm />
        <TestcaseForm />
        <Button variant="primary" type="submit" onClick={submit}>
          Submit
        </Button>
      </Card.Body>
    </Card>
  );
}
