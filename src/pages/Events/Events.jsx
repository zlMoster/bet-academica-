import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import { getEvents } from '../../services/eventService';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const sports = [...new Set(events.map((e) => e.esporte))];

  const filtered = events.filter((e) => {
    if (filter === 'todos') return e.status === 'aberto';
    return e.status === 'aberto' && e.esporte === filter;
  });

  if (loading) return <Loading />;

  return (
    <div className="page-content">
      <Header title="Eventos Disponíveis" subtitle="Escolha um evento e faça sua aposta fictícia" />

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${filter === 'todos' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('todos')}
        >
          Todos
        </button>
        {sports.map((sport) => (
          <button
            key={sport}
            className={`btn btn-sm ${filter === sport ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(sport)}
          >
            {sport}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum evento aberto encontrado.</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((event) => (
            <Card key={event.id} title={event.nome}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {event.esporte} • {event.data}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <span>Casa: <strong>{event.odd_casa}</strong></span>
                {event.odd_empate > 0 && <span>Empate: <strong>{event.odd_empate}</strong></span>}
                <span>Visitante: <strong>{event.odd_visitante}</strong></span>
              </div>
              <Link to={`/bets/${event.id}`} className="btn btn-primary btn-sm">
                Fazer Aposta
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
