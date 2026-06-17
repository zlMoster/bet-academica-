import { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Modal from '../../../components/Modal/Modal';
import Table from '../../../components/Table/Table';
import Loading from '../../../components/Loading/Loading';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  informResult
} from '../../../services/eventService';
import { resolveBetsForEvent } from '../../../services/betService';
import { validateEventForm, hasErrors, parsePositiveNumber } from '../../../components/utils/validators';

const emptyEvent = {
  nome: '',
  esporte: 'Futebol',
  odd_casa: '',
  odd_empate: '',
  odd_visitante: '',
  data: ''
};

const getToday = () => new Date().toISOString().split('T')[0];

const getMaxDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().split('T')[0];
};

const FieldError = ({ message }) =>
  message ? <span className="form-error">{message}</span> : null;

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [resultado, setResultado] = useState('');
  const [formData, setFormData] = useState(emptyEvent);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData(emptyEvent);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      nome: event.nome,
      esporte: event.esporte,
      odd_casa: event.odd_casa,
      odd_empate: event.odd_empate || '',
      odd_visitante: event.odd_visitante,
      data: event.data
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();

    const errors = validateEventForm(formData, { isEditing: !!editingEvent });
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      nome: formData.nome.trim(),
      esporte: formData.esporte,
      data: formData.data,
      odd_casa: parsePositiveNumber(formData.odd_casa),
      odd_empate: parsePositiveNumber(formData.odd_empate) || 0,
      odd_visitante: parsePositiveNumber(formData.odd_visitante),
      status: editingEvent?.status || 'aberto',
      resultado: editingEvent?.resultado || null
    };

    setSaving(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
      } else {
        await createEvent(payload);
      }
      setIsModalOpen(false);
      setFormErrors({});
      await loadEvents();
    } catch {
      setFormErrors({ _form: 'Erro ao salvar evento. Verifique se o servidor está rodando.' });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.status === 'aberto' ? 'encerrado' : 'aberto';
    await updateEvent(event.id, { status: newStatus });
    loadEvents();
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir este evento?')) return;
    await deleteEvent(id);
    loadEvents();
  };

  const openResultModal = (event) => {
    setSelectedEvent(event);
    setResultado('');
    setIsResultModalOpen(true);
  };

  const handleInformResult = async () => {
    if (!resultado) return alert('Selecione o resultado.');

    try {
      await informResult(selectedEvent.id, resultado);
      await resolveBetsForEvent(selectedEvent.id, resultado);
      setIsResultModalOpen(false);
      await loadEvents();
      alert('Resultado informado! Apostas atualizadas e saldos creditados.');
    } catch {
      alert('Erro ao informar resultado. Verifique se o servidor está rodando.');
    }
  };

  if (loading) return <Loading />;

  const stats = [
    { value: events.length, label: 'Total de Eventos' },
    { value: events.filter((e) => e.status === 'aberto').length, label: 'Abertos' },
    { value: events.filter((e) => e.status === 'encerrado').length, label: 'Encerrados' },
    { value: events.filter((e) => e.status === 'finalizado').length, label: 'Finalizados' }
  ];

  return (
    <div className="page-content animate-fade-in">
      <Header title="Painel do Administrador" subtitle="Gerenciamento completo de eventos esportivos" />

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={stat.label} className="stat-card animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="page-actions animate-fade-up" style={{ animationDelay: '320ms' }}>
        <button onClick={openCreateModal} className="btn btn-primary">
          + Novo Evento
        </button>
      </div>

      <div className="table-wrapper animate-fade-up" style={{ animationDelay: '400ms' }}>
        <Table columns={[
          { key: 'nome', label: 'Evento' },
          { key: 'esporte', label: 'Esporte' },
          { key: 'data', label: 'Data' },
          { key: 'odds', label: 'Odds' },
          { key: 'status', label: 'Status' },
          { key: 'resultado', label: 'Resultado' },
          { key: 'acoes', label: 'Ações' }
        ]}>
          {events.map((event) => (
            <tr key={event.id}>
              <td><strong>{event.nome}</strong></td>
              <td>{event.esporte}</td>
              <td>{event.data}</td>
              <td className="odds-cell">
                C:{event.odd_casa} E:{event.odd_empate || '-'} V:{event.odd_visitante}
              </td>
              <td><span className={`badge badge-${event.status}`}>{event.status}</span></td>
              <td>{event.resultado || '-'}</td>
              <td>
                <div className="action-buttons">
                  {event.status !== 'finalizado' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange(event)}>
                      {event.status === 'aberto' ? 'Encerrar' : 'Reabrir'}
                    </button>
                  )}
                  {event.status === 'encerrado' && (
                    <button className="btn btn-success btn-sm" onClick={() => openResultModal(event)}>
                      Resultado
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(event)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event.id)}>
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Editar Evento' : 'Novo Evento'}
      >
        <form onSubmit={handleSaveEvent} noValidate>
          {formErrors._form && <div className="alert alert-danger">{formErrors._form}</div>}

          <div className="form-group">
            <label htmlFor="nome">Nome do Evento</label>
            <input
              id="nome"
              className={`form-input ${formErrors.nome ? 'input-error' : ''}`}
              value={formData.nome}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              maxLength={120}
              placeholder="Ex: Flamengo x Palmeiras"
            />
            <FieldError message={formErrors.nome} />
          </div>

          <div className="form-group">
            <label htmlFor="esporte">Esporte</label>
            <select
              id="esporte"
              className="form-select"
              value={formData.esporte}
              onChange={(e) => handleFieldChange('esporte', e.target.value)}
            >
              <option>Futebol</option>
              <option>Basquete</option>
              <option>Vôlei</option>
              <option>Tênis</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="data">Data do Evento</label>
            <input
              id="data"
              type="date"
              className={`form-input ${formErrors.data ? 'input-error' : ''}`}
              value={formData.data}
              min={editingEvent ? undefined : getToday()}
              max={getMaxDate()}
              onChange={(e) => handleFieldChange('data', e.target.value)}
            />
            <FieldError message={formErrors.data} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="odd_casa">Odd Casa</label>
              <input
                id="odd_casa"
                type="number"
                step="0.01"
                min="1.01"
                max="999.99"
                className={`form-input ${formErrors.odd_casa ? 'input-error' : ''}`}
                value={formData.odd_casa}
                onChange={(e) => handleFieldChange('odd_casa', e.target.value)}
                placeholder="1.01"
              />
              <FieldError message={formErrors.odd_casa} />
            </div>

            <div className="form-group">
              <label htmlFor="odd_empate">Odd Empate</label>
              <input
                id="odd_empate"
                type="number"
                step="0.01"
                min="0"
                max="999.99"
                className={`form-input ${formErrors.odd_empate ? 'input-error' : ''}`}
                value={formData.odd_empate}
                onChange={(e) => handleFieldChange('odd_empate', e.target.value)}
                placeholder={formData.esporte === 'Futebol' ? '1.01' : '0'}
              />
              <FieldError message={formErrors.odd_empate} />
            </div>

            <div className="form-group">
              <label htmlFor="odd_visitante">Odd Visitante</label>
              <input
                id="odd_visitante"
                type="number"
                step="0.01"
                min="1.01"
                max="999.99"
                className={`form-input ${formErrors.odd_visitante ? 'input-error' : ''}`}
                value={formData.odd_visitante}
                onChange={(e) => handleFieldChange('odd_visitante', e.target.value)}
                placeholder="1.01"
              />
              <FieldError message={formErrors.odd_visitante} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Evento'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title={`Resultado: ${selectedEvent?.nome}`}
      >
        <p className="modal-description">
          Informe o resultado para atualizar o status das apostas.
        </p>
        <div className="form-group">
          <label htmlFor="resultado">Resultado</label>
          <select
            id="resultado"
            className="form-select"
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="casa">Casa</option>
            {selectedEvent?.odd_empate > 0 && <option value="empate">Empate</option>}
            <option value="visitante">Visitante</option>
          </select>
        </div>
        <button onClick={handleInformResult} className="btn btn-success btn-block">
          Confirmar Resultado
        </button>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
