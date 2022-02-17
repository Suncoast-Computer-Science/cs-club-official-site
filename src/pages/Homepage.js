import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";

import Header from "../components/Header";

export default function Homepage() {
  return (
    <>
      <Header />

      <Container fluid className="py-3 my-2">
        <Card>
          <Card.Body className="px-4">
            <Row>
              <Col sm={12} lg={8}>
                <h1> December Inter-School Competition</h1>
              </Col>
            </Row>
            <Row>
              <p>
                The Suncoast CS Club December Inter-School Competition is a high
                school programming contest for students in grades 9-12. The
                programming contest is modeled after USA Computing Olympiad, and
                the UCF High School Programming Contest. The contest will
                require students to use their understandings of logic,
                algorithms, and data structures to solve programming puzzles.
              </p>
            </Row>
            <Row>
              <Col sm={12} lg={8}>
                <h3>Details</h3>
              </Col>
              <p>
                The Suncoast CS Club December Inter-School Competition is a high
                school programming contest for students in grades 9-12. The
                programming contest is modeled after USA Computing Olympiad, and
                the UCF High School Programming Contest. The contest will
                require students to use their understandings of logic,
                algorithms, and data structures to solve programming puzzles.
              </p>
            </Row>
          </Card.Body>
          <Button className="m-2">Register</Button>
        </Card>
      </Container>
    </>
  );
}
