import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../components/Header/Header';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="page-content">
      <Header title="Meu Perfil" subtitle="Informações da sua conta" />

      <div className="card" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nome</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{user?.nome}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>E-mail</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{user?.email}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Perfil</span>
            <p>
              <span className={`badge ${user?.perfil === 'admin' ? 'badge-finalizado' : 'badge-aberto'}`}>
                {user?.perfil === 'admin' ? 'Administrador' : 'Jogador'}
              </span>
            </p>
          </div>
          {user?.perfil === 'user' && (
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Saldo Fictício</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue-primary)' }}>
                R$ {user?.saldo?.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
