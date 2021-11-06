import { Button } from 'react-bootstrap'
import { useAuth } from '../api/AuthContext.js'


// Proof of concept that signout works
export default function Settings() {
  const { signout } = useAuth()

  return (
    <Button
      href="/"
      onClick={signout}
    >
      Signout
    </Button>
  )
}
