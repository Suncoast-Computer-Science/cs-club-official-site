//import { useRef } from "react";
import { Button, Card } from "react-bootstrap";
import { useAuth } from "../api/AuthContext.js";
import Header from "../components/Header";

// Proof of concept that signout works
export default function Settings() {
  //const { signout, updateEmail } = useAuth();
  //const newEmailRef = useRef();
  const { signout } = useAuth();

  return (
    <>
      <Header />
      <Card className="m-2">
        <Card.Body>
          <Card.Title>Settings</Card.Title>
          <Card.Text>
            Changing your account settings is currently not possible. If you
            require assistance with your account, please contact Rohit Dasgupta
            at rohit.dasgupta922@gmail.com
          </Card.Text>
          {/* <div>
            <label>Change Email</label>
            <input default="New Email address" ref={newEmailRef} />
            <button onClick={() => updateEmail(newEmailRef.current.value)}>
              Set new Email
            </button>
          </div>
          <div>
            <label>Change Password</label>
            <input default="New Password" />
            <button> Set new Password</button>
          </div> */}
        </Card.Body>
        <Card.Footer className="text-muted">
          <Button className="float-end" href="/" onClick={signout}>
            Signout
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}
