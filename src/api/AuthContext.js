import { useState, useEffect, createContext, useContext } from 'react'

import { auth, provider } from './firebase'

const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function register(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
    // .then((auth) => {
    // if (auth.user) {
    //   auth.user.updateProfile({
    //     displayName: username
    //   })
    // }
    // })
  }

  function signin(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }


  function signout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoading(false)
      setCurrentUser(user)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    register,
    signin,
    signout,
    resetPassword,
    updateEmail,
    updatePassword,
    db: auth.app.database()
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
export { AuthProvider, useAuth }
