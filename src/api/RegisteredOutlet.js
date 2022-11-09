import { useState, useEffect } from 'react';
import { Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { useAuth } from './AuthContext';

export default function RegisteredOutlet({ children, ...rest }) {
	const location = useLocation();
	const [pending, setPending] = useState(true);
	const [isRegistered, setIsRegistered] = useState();
	const { auth } = useAuth();

	useEffect(() => {
		if (location.pathname == '/register') return;

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			console.log('bruh');
			setPending(false);

			if (!user.uid) {
				setIsRegistered(true);
				return;
			}

			const userDataRef = ref(db, `users/${user.uid}`);
			const userDataSnapshot = await get(userDataRef);
			if (userDataSnapshot.val() == null) {
				// navigate("/register")
				setIsRegistered(false);
			}
		});
		return unsubscribe;
	}, []);

	if (pending || location.pathname == '/register') return <Outlet />;
	return isRegistered ? <Outlet /> : <Navigate to='/register' />;
	// return (<Route {...rest} render={() => render ? children : <Navigate to="/register"/>} />)
}
