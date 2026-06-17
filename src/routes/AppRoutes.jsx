import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import GuestRoute from '../components/GuestRoute/GuestRoute';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import AdminDashboard from "../pages/Admin/Users/AdminDashboard";
import Users from "../pages/Admin/Users/Users";
import Register from '../pages/Register/Register';
import Ranking from '../pages/Ranking/Ranking';
import Profile from '../pages/Profile/Profile';
import Events from '../pages/Events/Events';
import BetPage from '../pages/Bets/BetPage';
import BetHistory from '../pages/Bets/BetHistory';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

    <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><Dashboard /></ProtectedRoute>} />
    <Route path="/events" element={<ProtectedRoute allowedRoles={['user']}><Events /></ProtectedRoute>} />
    <Route path="/bets/history" element={<ProtectedRoute allowedRoles={['user']}><BetHistory /></ProtectedRoute>} />
    <Route path="/bets/:eventId" element={<ProtectedRoute allowedRoles={['user']}><BetPage /></ProtectedRoute>} />
    <Route path="/ranking" element={<ProtectedRoute allowedRoles={['user']}><Ranking /></ProtectedRoute>} />

    <Route path="/profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Profile /></ProtectedRoute>} />

    <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />

    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
