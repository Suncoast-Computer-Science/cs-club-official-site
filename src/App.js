import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './api/AuthContext'
import PrivateRoute from "./api/PrivateRoute"
import Homepage from './pages/Homepage';
import Competitions from './pages/Competitions';
import CompetitionHomepage from './pages/CompetitionHomepage';
import ProblemHomepage from './pages/ProblemHomepage';
import Signin from './pages/Signin';
import Register from './pages/Register';
import About from './pages/About';
import Settings from './pages/Settings';
import Editor from './components/Editor';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/editor-test" element={<Editor />} />
          <Route exact path="/competitions" element={<Competitions />} />
          <Route path="/competitions/:id" element={<CompetitionHomepage />} />
          <Route path="/competitions/:competitionId/:problemId" element={<ProblemHomepage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route exact path="/settings" element={<PrivateRoute />}>
            <Route exact path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
