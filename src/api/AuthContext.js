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
	const [firstTime, setFirstTime] = useState();

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

	let x = 0;
	useEffect(() => {
		let newFirstTime = false;
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setLoading(false);
			setCurrentUser(user);
			x = 1;
			try {
				const userId = user.uid;
				const dbRef = ref(getDatabase());
				get(child(dbRef, `users/${userId}`)).then((snapshot) => {
					newFirstTime = !snapshot.exists();
				});
			} catch (error) {
				console.error('ERROR: No current user');
			}
			// if (user) {
			// 	const userId = user.uid;
			// 	const dbRef = ref(getDatabase());
			// 	get(child(dbRef, `users/${userId}`)).then((snapshot) => {
			// 		// if (!snapshot.exists()) {
			// 		// 	newFirstTime = true;
			// 		// 	const x = 2;
			// 		// } else {
			// 		// 	newFirstTime = false;
			// 		// }
			// 		newFirstTime = !snapshot.exists();
			// 		console.log(newFirstTime);
			// 	});
			// } else {
			// 	console.log('No current user');
			// }
			// setFirstTime(newFirstTime);
		});
		console.log(x);

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		firstTime,
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
