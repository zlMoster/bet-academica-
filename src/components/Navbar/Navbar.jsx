import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { refreshUser, refreshing } = useUser();
  const navigate = useNavigate();
  const isAdmin = user?.perfil === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefreshBalance = async () => {
    if (user?.perfil === 'user') await refreshUser();
  };

  return (
    <nav className="navbar">
      <Link to={isAdmin ? '/admin/events' : '/dashboard'} className="navbar-brand">
        G2XBet
      </Link>

      <div className="navbar-user">
        <span className="user-info">
          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>{user?.nome}</span>
          {user?.perfil === 'user' && (
            <button
              type="button"
              className="user-balance"
              onClick={handleRefreshBalance}
              title="Atualizar saldo"
            >
              R$ {Number(user?.saldo).toFixed(2)} {refreshing ? '↻' : ''}
            </button>
          )}
        </span>
        <button onClick={handleLogout} className="btn-logout">
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Navbar;