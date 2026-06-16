import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../Loading/Loading';

const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;
  if (user) {
    return <Navigate to={user.perfil === 'admin' ? '/admin/events' : '/dashboard'} replace />;
  }

  return children;
};

export default GuestRoute;
