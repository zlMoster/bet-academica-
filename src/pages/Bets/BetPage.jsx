import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import { getEventById } from '../../services/eventService';
import { getBetsByUserAndEvent, placeBet } from '../../services/betService';
import { updateUserBalance } from '../../services/userService';
import { validateBetAmount } from '../../components/utils/validators';

const BetPage = () => {
  const { eventId } = useParams();
  const { user } = useContext(AuthContext);
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [palpite, setPalpite] = useState('');
  const [valor, setValor] = useState('');
  const [existingBet, setExistingBet] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadEventAndBet = async () => {
      setLoading(true);
      try {
        if (user?.id) await refreshUser();

        const [eventRes, betRes] = await Promise.all([
          getEventById(eventId),
          user?.id ? getBetsByUserAndEvent(eventId, user.id) : Promise.resolve({ data: [] })
        ]);

        setEvent(eventRes.data);
        setExistingBet(betRes.data[0] || null);
      } catch {
        setError('Evento não encontrado');
      } finally {
        setLoading(false);
      }
    };

    loadEventAndBet();
  }, [eventId, refreshUser, user?.id]);

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

    const amountError = validateBetAmount(valor, Number(user.saldo));
    if (amountError) {
      setError(amountError);
      return;
    }

    if (existingBet) {
      setError('Você já apostou neste evento. Não é possível apostar novamente.');
      return;
    }

    const betValue = Number(valor);

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
        retorno: 0,
        data: new Date().toISOString().split('T')[0]
      });

      const novoSaldo = Number(user.saldo) - betValue;
      await updateUserBalance(user.id, novoSaldo);
      await refreshUser();

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
    <div className="page-content animate-fade-in">
      <Header title="Fazer Aposta" subtitle={event.nome} />

      <div className="bet-form-container">
        <Card>
          <div className="bet-event-info">
            <span><strong>Esporte:</strong> {event.esporte}</span>
            <span><strong>Data:</strong> {event.data}</span>
            <span className="bet-balance">Saldo: R$ {Number(user.saldo).toFixed(2)}</span>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {existingBet && (
            <div className="alert alert-warning">
              Você já apostou neste evento no resultado <strong>{existingBet.palpite}</strong>.
              Não é possível apostar novamente neste jogo.
            </div>
          )}

          <form onSubmit={handleBet}>
            <div className="form-group">
              <label htmlFor="palpite">Palpite</label>
              <select
                id="palpite"
                className="form-select"
                value={palpite}
                onChange={(e) => setPalpite(e.target.value)}
                required
                disabled={Boolean(existingBet)}
              >
                <option value="">Selecione...</option>
                {palpiteOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="valor">Valor da Aposta (R$)</label>
              <input
                id="valor"
                type="number"
                className="form-input"
                min="1"
                max={user.saldo}
                step="1"
                value={valor}
                onChange={(e) => setValor(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Ex: 100"
                required
                disabled={Boolean(existingBet)}
              />
            </div>

            {palpite && valor && (
              <div className="bet-return-preview">
                Retorno potencial: <strong>R$ {retorno}</strong>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting || Boolean(existingBet)}>
              {submitting ? 'Processando...' : 'Confirmar Aposta'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BetPage;
