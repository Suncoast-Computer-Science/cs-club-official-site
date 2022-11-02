import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	verifyBeforeUpdateEmail,
	sendEmailVerification,
	signOut,
	onAuthStateChanged,
	updatePassword as updateUserPassword,
} from 'firebase/auth';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);

	async function register(email, password) {
		try {
			const credential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = credential.user;
			sendEmailVerification(user);
		} catch (error) {
			return error;
		}
	}

	async function signin(email, password) {
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			return error;
		}
	}

	function signout() {
		return signOut(auth);
	}

	function updateEmail(newEmail) {
		verifyBeforeUpdateEmail(currentUser, newEmail);
	}

	function updatePassword(newPassword) {
		updateUserPassword(currentUser, newPassword);
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
		updatePassword,
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
