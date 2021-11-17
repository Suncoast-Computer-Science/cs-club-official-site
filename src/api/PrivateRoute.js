import { Route, Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../api/AuthContext';

// Must have an account to enter
export default function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return auth ? <Outlet /> : <Navigate to="/login" />;
}
