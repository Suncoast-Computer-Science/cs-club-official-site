import { useRef } from 'react'
import { Redirect, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

import { useAuth } from '../api/AuthContext'

export default function Signin() {
  const navigate = useNavigate()
  const { signin } = useAuth()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  function handleEvent(e) {
    e.preventDefault();
    // console.log(emailRef.current.value, passwordRef.current.value)
    const email = emailRef.current.value
    const password = passwordRef.current.value
    signin(email, password)
    navigate('/')
  }

  return (
    <>
      {/* Put this inside a card and make it look pretty*/}
      <Form>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" ref={emailRef} placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" ref={passwordRef} placeholder="Password" />
        </Form.Group>
        <Button variant="primary" onClick={handleEvent} type="submit">
          Submit
        </Button>
        <a href="/register"> Don't have an account? Register </a>
      </Form>
    </>
  )
}
