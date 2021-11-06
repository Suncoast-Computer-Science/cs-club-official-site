import { Navbar, Container, Nav, Row } from 'react-bootstrap';

import SigninButton from '../components/SigninButton'

export default function Header() {
  return (

    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Suncoast CS Club</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/competitions">Competitions</Nav.Link>
          </Nav>
          <Row>
            <SigninButton />
          </Row>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  )
}
