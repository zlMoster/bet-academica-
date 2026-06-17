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

      <div className="navbar-links">
        {isAdmin ? (
          <>
            <Link to="/admin/events">Eventos</Link>
            <Link to="/admin/users">Usuários</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/events">Eventos</Link>
            <Link to="/bets/history">Histórico</Link>
            <Link to="/ranking">Ranking</Link>
          </>
        )}
        <Link to="/profile">Perfil</Link>
      </div>

      <div className="navbar-user">
        <span className="user-info">
          {user?.nome}
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
