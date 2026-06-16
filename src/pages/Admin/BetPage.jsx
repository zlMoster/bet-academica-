import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import { getEventById } from '../../services/eventService';
import { placeBet } from '../../services/betService';
import { getUserById, updateUserBalance } from '../../services/userService';

const BetPage = () => {
  const { eventId } = useParams();
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [palpite, setPalpite] = useState('');
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getEventById(eventId)
      .then((res) => setEvent(res.data))
      .catch(() => setError('Evento não encontrado'))
      .finally(() => setLoading(false));
  }, [eventId]);

  const getOdd = () => {
    if (!event || !palpite) return 0;
    if (palpite === 'casa') return event.odd_casa;
    if (palpite === 'empate') return event.odd_empate;
    return event.odd_visitante;
  };

  const retorno = valor ? (Number(valor) * getOdd()).toFixed(2) : '0.00';

  const handleBet = async (e) => {
    e.preventDefault();
    setError('');

    if (event.status !== 'aberto') {
      setError('Este evento não está aberto para apostas.');
      return;
    }

    const betValue = Number(valor);
    if (betValue <= 0 || betValue > user.saldo) {
      setError('Valor inválido ou saldo insuficiente.');
      return;
    }

    setSubmitting(true);
    try {
      const odd = getOdd();
      await placeBet({
        userId: user.id,
        eventId: event.id,
        eventNome: event.nome,
        palpite,
        valor: betValue,
        odd,
        status: 'pendente',
        data: new Date().toISOString().split('T')[0]
      });

      const novoSaldo = user.saldo - betValue;
      await updateUserBalance(user.id, novoSaldo);
      const { data: updatedUser } = await getUserById(user.id);
      updateUser(updatedUser);

      alert('Aposta realizada com sucesso!');
      navigate('/bets/history');
    } catch {
      setError('Erro ao realizar aposta.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!event) return <div className="empty-state"><p>{error || 'Evento não encontrado'}</p></div>;

  const palpiteOptions = [
    { value: 'casa', label: `Casa (${event.odd_casa})`, show: event.odd_casa > 0 },
    { value: 'empate', label: `Empate (${event.odd_empate})`, show: event.odd_empate > 0 },
    { value: 'visitante', label: `Visitante (${event.odd_visitante})`, show: event.odd_visitante > 0 }
  ].filter((o) => o.show);

  return (
    <div className="page-content">
      <Header title="Fazer Aposta" subtitle={event.nome} />

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Esporte:</strong> {event.esporte}<br />
            <strong>Data:</strong> {event.data}<br />
            <strong>Seu saldo:</strong> R$ {user.saldo?.toFixed(2)}
          </p>

          {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}

          <form onSubmit={handleBet}>
            <div className="form-group">
              <label>Palpite</label>
              <select
                className="form-select"
                value={palpite}
                onChange={(e) => setPalpite(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {palpiteOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Valor da Aposta (R$)</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max={user.saldo}
                step="1"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>

            {palpite && valor && (
              <p style={{ marginBottom: '1rem', color: 'var(--blue-primary)', fontWeight: 600 }}>
                Retorno potencial: R$ {retorno}
              </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Processando...' : 'Confirmar Aposta'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BetPage;
