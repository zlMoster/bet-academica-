import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import { getEvents } from '../../services/eventService';
import { getHistory } from '../../services/betService';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [eventsRes, betsRes] = await Promise.all([
        getEvents(),
        getHistory(user.id)
      ]);
      setEvents(eventsRes.data.filter((e) => e.status === 'aberto'));
      setBets(betsRes.data);
      setLoading(false);
    };
    load();
  }, [user.id]);

  const pendingBets = bets.filter((b) => b.status === 'pendente').length;
  const wonBets = bets.filter((b) => b.status === 'ganhou').length;

  if (loading) return <Loading />;

  return (
    <div className="page-content">
      <Header
        title={`Olá, ${user.nome}!`}
        subtitle="Resumo da sua conta e eventos disponíveis"
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">R$ {user.saldo?.toFixed(2)}</div>
          <div className="stat-label">Saldo Disponível</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{events.length}</div>
          <div className="stat-label">Eventos Abertos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{bets.length}</div>
          <div className="stat-label">Total de Apostas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{wonBets}</div>
          <div className="stat-label">Apostas Ganhas</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--blue-dark)' }}>Eventos Disponíveis</h2>
        <Link to="/events" className="btn btn-primary btn-sm">Ver todos</Link>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum evento aberto no momento.</p>
        </div>
      ) : (
        <div className="card-grid">
          {events.slice(0, 3).map((event) => (
            <Card key={event.id} title={event.nome} description={`${event.esporte} • ${event.data}`}>
              <p style={{ marginBottom: '1rem' }}>
                <span className={`badge badge-${event.status}`}>{event.status}</span>
              </p>
              <Link to={`/bets/${event.id}`} className="btn btn-primary btn-sm">
                Apostar
              </Link>
            </Card>
          ))}
        </div>
      )}

      {pendingBets > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <Card title="Apostas Pendentes" description={`Você tem ${pendingBets} aposta(s) aguardando resultado.`}>
            <Link to="/bets/history" className="btn btn-secondary btn-sm">Ver histórico</Link>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
