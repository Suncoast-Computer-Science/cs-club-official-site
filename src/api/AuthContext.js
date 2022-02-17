import { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function register() {
    return signInWithPopup(auth, provider);
  }

  function signin() {
    return signInWithPopup(auth, provider);
  }

  function signout() {
    return signOut(auth);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export { AuthProvider, useAuth };
