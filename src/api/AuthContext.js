import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

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

	async function register(
		userId,
		name,
		schoolEmail,
		personalEmail,
		photoURL,
		grade,
		consent
	) {
		const db = getDatabase();
		try {
			set(ref(db, 'users/' + userId), {
				name: name,
				school_email: schoolEmail,
				personal_email: personalEmail,
				profile_picture: photoURL,
				grade_level: grade,
				email_consent: consent,
			});
		} catch (error) {
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
		register,
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
