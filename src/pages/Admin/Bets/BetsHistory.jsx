import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import { getHistory } from '../../services/betService';

const statusLabel = {
  pendente: 'Pendente',
  ganhou: 'Ganhou',
  perdeu: 'Perdeu'
};

const palpiteLabel = {
  casa: 'Casa',
  empate: 'Empate',
  visitante: 'Visitante'
};

const BetHistory = () => {
  const { user } = useContext(AuthContext);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory(user.id).then((res) => {
      setBets(res.data.reverse());
      setLoading(false);
    });
  }, [user.id]);

  if (loading) return <Loading />;

  return (
    <div className="page-content">
      <Header title="Histórico de Apostas" subtitle="Acompanhe todas as suas apostas fictícias" />

      {bets.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não fez nenhuma aposta.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Evento</th>
              <th>Palpite</th>
              <th>Valor</th>
              <th>Odd</th>
              <th>Retorno</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet) => (
              <tr key={bet.id}>
                <td>{bet.data}</td>
                <td>{bet.eventNome}</td>
                <td>{palpiteLabel[bet.palpite] || bet.palpite}</td>
                <td>R$ {Number(bet.valor).toFixed(2)}</td>
                <td>{bet.odd}</td>
                <td>
                  {bet.status === 'ganhou'
                    ? `R$ ${(bet.valor * bet.odd).toFixed(2)}`
                    : bet.status === 'pendente'
                      ? `R$ ${(bet.valor * bet.odd).toFixed(2)} (pot.)`
                      : '-'}
                </td>
                <td>
                  <span className={`badge badge-${bet.status}`}>
                    {statusLabel[bet.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BetHistory;
