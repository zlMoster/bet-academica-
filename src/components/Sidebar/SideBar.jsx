import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.perfil === 'admin';

  const linkClass = ({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link');

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>⚽</span>
        <strong>Bet Acadêmica</strong>
      </div>

      {isAdmin ? (
        <>
          <NavLink to="/admin/events" className={linkClass}>📋 Eventos</NavLink>
          <NavLink to="/admin/users" className={linkClass}>👥 Usuários</NavLink>
          <NavLink to="/profile" className={linkClass}>👤 Perfil</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/dashboard" className={linkClass}>📊 Dashboard</NavLink>
          <NavLink to="/events" className={linkClass}>🏟️ Eventos</NavLink>
          <NavLink to="/bets/history" className={linkClass}>📜 Histórico</NavLink>
          <NavLink to="/ranking" className={linkClass}>🏆 Ranking</NavLink>
          <NavLink to="/profile" className={linkClass}>👤 Perfil</NavLink>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
