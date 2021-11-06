import { Route, Navigate } from 'react-router-dom';

import { useAuth } from '../api/AuthContext';

// Must have an account to enter
export default function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={() => auth
        ? children
        : <Navigate to="/login" />
      } />
  )
}
