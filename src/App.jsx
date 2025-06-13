import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';
import SignIn from './pages/SignIn';
import Recognition from './pages/Recognition';
import CareSolution from './pages/CareSolution';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Me from './pages/Me';
import PlantStatus from './pages/PlantStatus';
import BreathingLogo from './components/BreathingLogo';

function AppRoutes() {
  const location = useLocation();
  const showLogo = location.pathname !== '/signin';

  return (
    <>
      {showLogo && <BreathingLogo />}
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/recognition" element={<Recognition />} />
        <Route path="/care-solution" element={<CareSolution />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/news" element={<News />} />
        <Route path="/plant-status" element={<PlantStatus />} />
        <Route path="/me" element={<Me />} />

      </Routes>
    </>
  );
}

export default function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
