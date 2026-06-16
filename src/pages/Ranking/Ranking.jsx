import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import { getRanking } from '../../services/userService';
import './Ranking.css';

const medals = ['🥇', '🥈', '🥉'];

const Ranking = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRanking().then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="page-content">
      <Header
        title="Ranking de Jogadores"
        subtitle="Classificação por saldo fictício — prêmios acadêmicos simulados"
      />

      <div className="ranking-info card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--blue-dark)', marginBottom: '0.5rem' }}>Como funciona?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          O ranking é atualizado automaticamente com base no saldo fictício de cada jogador.
          Quanto mais apostas você acertar, maior será seu saldo e melhor sua posição.
          Os 3 primeiros colocados recebem prêmios simulados: 🥇 500 pts | 🥈 300 pts | 🥉 100 pts.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum jogador cadastrado ainda.</p>
        </div>
      ) : (
        <>
          <div className="ranking-podium">
            {users.slice(0, 3).map((user, i) => (
              <div key={user.id} className={`podium-item podium-${i + 1}`}>
                <span className="podium-medal">{medals[i]}</span>
                <span className="podium-name">{user.nome}</span>
                <span className="podium-balance">R$ {Number(user.saldo).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Saldo Fictício</th>
                <th>Prêmio Simulado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} className={i < 3 ? 'ranking-top' : ''}>
                  <td>
                    {i < 3 ? medals[i] : `${i + 1}º`}
                  </td>
                  <td><strong>{user.nome}</strong></td>
                  <td>R$ {Number(user.saldo).toFixed(2)}</td>
                  <td>
                    {i === 0 && '500 pts'}
                    {i === 1 && '300 pts'}
                    {i === 2 && '100 pts'}
                    {i > 2 && '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Ranking;
