import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import './Navbar.css';

const Navbar = () => {
  // Puxando os dados globais do usuário e a função de logout do contexto de autenticação
  const { user, logout } = useContext(AuthContext);
  
  // Hooks para atualizar o saldo do usuário (limita os reloads na API)
  const { refreshUser, refreshing } = useUser();
  const navigate = useNavigate();
  
  // Verificação rápida para saber se o usuário logado é administrador
  const isAdmin = user?.perfil === 'admin';

  // Função para deslogar o usuário e mandar direto para a tela de login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Atualiza o saldo no banco (JSON Server) apenas se for um usuário comum
  const handleRefreshBalance = async () => {
    if (user?.perfil === 'user') await refreshUser();
  };

  return (
    <nav className="navbar">
      {/* Se for admin vai para a tela de gerenciar eventos, se for user vai para o dashboard */}
      <Link to={isAdmin ? '/admin/events' : '/dashboard'} className="navbar-brand">
        G2XBet
      </Link>

      <div className="navbar-user">
        <span className="user-info">
          {/* Nome do usuário vindo dinamicamente da sessão */}
          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>{user?.nome}</span>
          
          {/* Regra de negócio: Só renderiza o saldo e o botão de atualizar se NÃO for admin */}
          {user?.perfil === 'user' && (
            <button
              type="button"
              className="user-balance"
              onClick={handleRefreshBalance}
              title="Atualizar saldo"
            >
              {/* Formata o saldo para exibir sempre com duas casas decimais */}
              R$ {Number(user?.saldo).toFixed(2)} {refreshing ? '↻' : ''}
            </button>
          )}
        </span>
        
        {/* Botão de Logout padrão */}
        <button onClick={handleLogout} className="btn-logout">
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Navbar;