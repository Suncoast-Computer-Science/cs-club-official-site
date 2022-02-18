import { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  verifyBeforeUpdateEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  updatePassword as updateUserPassword,
} from "firebase/auth";

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password).then(credential => {
      const user = credential.user;
      sendEmailVerification(user);
    })

  }

  function signin(email, password) {
    signInWithEmailAndPassword(auth, email, password)
  }

  function signout() {
    return signOut(auth);
  }

  function updateEmail(newEmail) {
    verifyBeforeUpdateEmail(currentUser, newEmail);
  }

  function updatePassword(newPassword) {
    updateUserPassword()
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    signin,
    signout,
    updateEmail,
    db,
    auth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export { AuthProvider, useAuth };
