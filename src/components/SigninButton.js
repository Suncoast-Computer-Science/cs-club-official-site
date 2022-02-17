import { Button } from 'react-bootstrap'

import { useAuth } from "../api/AuthContext"

export default function SigninButton() {
  const { currentUser, signout } = useAuth();

  return (
    <Button
      href={currentUser ? "/settings" : "/signin"}
      onClick={signout}
    >
      {currentUser ? "Sign Out" : "Sign In"}
    </Button>
  )
}
