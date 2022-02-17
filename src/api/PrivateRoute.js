import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { useAuth } from "../api/AuthContext";

export default function PrivateRoute({ children }) {
  const [pending, setPending] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const { auth } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setPending(false);
    });

    return unsubscribe; // <-- clean up subscription
  }, []);

  if (pending) return null; // don't do anything yet

  return currentUser ? children : <Navigate to="/signin" />; // <-- redirect to log in
}
