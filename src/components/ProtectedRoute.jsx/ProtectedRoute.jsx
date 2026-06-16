import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../Loading/Loading';

const ProtectedRoute = ({ children, isAdminOnly }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" />;
  if (isAdminOnly && user.perfil !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
