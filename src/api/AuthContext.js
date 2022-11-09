import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, child, get } from 'firebase/database';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);

	async function signin() {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			// TODO: handle different errors separately
			console.log(error);
			return error;
		}
	}

	function signout() {
		return signOut(auth);
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
		signin,
		signout,
		db,
		auth,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
export { AuthProvider, useAuth };
