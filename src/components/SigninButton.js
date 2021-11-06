import { Button } from 'react-bootstrap'

import { useAuth } from "../api/AuthContext"

export default function SigninButton() {
  const { currentUser } = useAuth();

  return (
    <Button
      href={currentUser ? "/settings" : "/signin"}
    >
      {currentUser ? "Account" : "Sign In"}
    </Button>
  )
}
