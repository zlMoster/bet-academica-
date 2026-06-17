import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  // Pegando o usuário logado para saber as permissões de acesso aos menus
  const { user } = useContext(AuthContext);
  
  // Define se o usuário atual tem o perfil de administrador do sistema
  const isAdmin = user?.perfil === 'admin';

  return (
    <div className="sidebar-container">
      {/* O título da barra muda dinamicamente para avisar o tipo de painel */}
      <div className="sidebar-title">
        {isAdmin ? 'Painel Admin' : 'Navegação'}
      </div>
      
      <div className="sidebar-divider" />

      <ul className="sidebar-menu">
        {/* Renderização Condicional: Se for Admin, mostra apenas as ferramentas de gerenciar o app */}
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
          /* Se for cliente comum, renderiza o menu de apostas, histórico e ranking */
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
        
        {/* Divisória comum para separar as rotas principais do link de perfil */}
        <div className="sidebar-divider" />
        
        {/* O perfil fica visível e disponível para qualquer tipo de conta */}
        <li>
          <NavLink to="/profile" className="sidebar-link">
            Perfil
          </NavLink>
        </li>
      </ul>
      
      {/* Rodapé institucional padrão da plataforma acadêmica */}
      <div className="sidebar-footer">
        © 2026 G2XBet
      </div>
    </div>
  );
};

export default Sidebar;