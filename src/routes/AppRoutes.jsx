import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import Users from '../pages/Admin/Users/Users';
import Register from '../pages/Register/Register';
import Ranking from '../pages/Ranking/Ranking';
import Profile from '../pages/Profile/Profile';
import Events from '../pages/Events/Events';
import BetPage from '../pages/Bets/BetPage';
import BetHistory from '../pages/Bets/BetHistory';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
      <Route path="/bets/history" element={<ProtectedRoute><BetHistory /></ProtectedRoute>} />
      <Route path="/bets/:eventId" element={<ProtectedRoute><BetPage /></ProtectedRoute>} />
      <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="/admin/events" element={<ProtectedRoute isAdminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute isAdminOnly><Users /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
