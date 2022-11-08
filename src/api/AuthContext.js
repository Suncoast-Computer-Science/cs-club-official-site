import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, child, get } from 'firebase/database';

const AuthContext = createContext();

const navigate = useNavigate();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);

	async function signin() {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
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
			if (user) {
				const userId = user.uid;
				const dbRef = ref(getDatabase());
				get(child(dbRef, `users/${userId}`)).then((snapshot) => {
					if (!snapshot.exists()) {
						navigate('/register');
						console.log('New User');
					}
				});
			} else {
				console.log('No current user');
			}
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
