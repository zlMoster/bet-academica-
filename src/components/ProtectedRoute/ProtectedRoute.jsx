import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../Loading/Loading';

const ProtectedRoute = ({ children, allowedRoles, isAdminOnly }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  const roles = allowedRoles || (isAdminOnly ? ['admin'] : ['user', 'admin']);

  if (!roles.includes(user.perfil)) {
    const redirect = user.perfil === 'admin' ? '/admin/events' : '/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default ProtectedRoute;
