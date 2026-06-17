import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.perfil === 'admin';

  return (
    <div className="sidebar-container">
      <div className="sidebar-title">
        {isAdmin ? 'Painel Admin' : 'Navegação'}
      </div>
      
      <div className="sidebar-divider" />

      <ul className="sidebar-menu">
        {isAdmin ? (
          <>
            <li>
              <NavLink to="/admin/events" className="sidebar-link">
                Eventos
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className="sidebar-link">
                Usuários
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/dashboard" className="sidebar-link">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className="sidebar-link">
                Eventos
              </NavLink>
            </li>
            <li>
              <NavLink to="/bets/history" className="sidebar-link">
                Histórico
              </NavLink>
            </li>
            <li>
              <NavLink to="/ranking" className="sidebar-link">
                Ranking
              </NavLink>
            </li>
          </>
        )}
        
        <div className="sidebar-divider" />
        
        <li>
          <NavLink to="/profile" className="sidebar-link">
            Perfil
          </NavLink>
        </li>
      </ul>
      
      <div className="sidebar-footer">
        © 2026 G2XBet
      </div>
    </div>
  );
};

export default Sidebar;