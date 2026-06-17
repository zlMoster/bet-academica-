import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Loading from '../../components/Loading/Loading';
import { updateProfile, changePassword } from '../../services/userService';
import { getHistory } from '../../services/betService';
import {
  getTransactionsByUser,
  createDeposit,
  createWithdraw
} from '../../services/transactionService';
import {
  validateProfileForm,
  validatePasswordChange,
  validateWithdraw,
  validateDeposit,
  hasErrors
} from '../../components/utils/validators';
import './Profile.css';

const TABS = [
  { id: 'overview', label: 'Visão Geral', icon: '' },
  { id: 'account', label: 'Dados Pessoais', icon: '' },
  { id: 'security', label: 'Segurança', icon: '' },
  { id: 'wallet', label: 'Carteira', icon: '', userOnly: true },
  { id: 'extract', label: 'Extrato', icon: '', userOnly: true }
];

const FieldError = ({ message }) =>
  message ? <span className="form-error">{message}</span> : null;

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { refreshUser } = useUser();
  const isPlayer = user?.perfil === 'user';

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [bets, setBets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [profileForm, setProfileForm] = useState({ nome: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [walletForm, setWalletForm] = useState({ valor: '', tipo: 'saque' });

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [walletError, setWalletError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      await refreshUser();
      if (isPlayer) {
        const [betsRes, txRes] = await Promise.all([
          getHistory(user.id),
          getTransactionsByUser(user.id)
        ]);
        setBets(betsRes.data);
        setTransactions(txRes.data);
      }
    } catch {
      setBets([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileForm({ nome: user.nome || '', email: user.email || '' });
      loadData();
    }
  }, [user?.id]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errors = validateProfileForm(profileForm);
    if (hasErrors(errors)) {
      setProfileErrors(errors);
      return;
    }

    setSaving(true);
    setProfileErrors({});
    try {
      const { data } = await updateProfile(user.id, profileForm);
      updateUser(data);
      showMsg('success', 'Dados atualizados com sucesso!');
    } catch (err) {
      showMsg('danger', err.message || 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errors = validatePasswordChange(
      passwordForm.senhaAtual,
      passwordForm.novaSenha,
      passwordForm.confirmarSenha
    );
    if (hasErrors(errors)) {
      setPasswordErrors(errors);
      return;
    }

    setSaving(true);
    setPasswordErrors({});
    try {
      await changePassword(user.id, passwordForm.senhaAtual, passwordForm.novaSenha);
      setPasswordForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      showMsg('success', 'Senha alterada com sucesso!');
    } catch (err) {
      showMsg('danger', err.message || 'Erro ao alterar senha.');
    } finally {
      setSaving(false);
    }
  };

  const handleWallet = async (e) => {
    e.preventDefault();
    setWalletError('');

    const validator = walletForm.tipo === 'saque' ? validateWithdraw : validateDeposit;
    const error = validator(walletForm.valor, Number(user.saldo));
    if (error) {
      setWalletError(error);
      return;
    }

    setSaving(true);
    try {
      const amount = Number(walletForm.valor);

      // Persist the operation on the server and refresh local user and transactions
      if (walletForm.tipo === 'saque') {
        const { transaction, novoSaldo } = await createWithdraw(user.id, amount);
        await refreshUser();
        const txRes = await getTransactionsByUser(user.id);
        setTransactions(txRes.data);
        showMsg('success', `Saque de R$ ${amount.toFixed(2)} realizado com sucesso!`);
      } else {
        const { transaction, novoSaldo } = await createDeposit(user.id, amount);
        await refreshUser();
        const txRes = await getTransactionsByUser(user.id);
        setTransactions(txRes.data);
        showMsg('success', `Depósito de R$ ${amount.toFixed(2)} realizado com sucesso!`);
      }
      setWalletForm({ valor: '', tipo: walletForm.tipo });
    } catch (err) {
      setWalletError(err.message || 'Erro na operação.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  const wonBets = bets.filter((b) => b.status === 'ganhou').length;
  const lostBets = bets.filter((b) => b.status === 'perdeu').length;
  const pendingBets = bets.filter((b) => b.status === 'pendente').length;
  const totalWagered = bets.reduce((sum, b) => sum + Number(b.valor), 0);
  const initials = user?.nome?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  const visibleTabs = TABS.filter((t) => !t.userOnly || isPlayer);

  return (
    <div className="page-content profile-page animate-fade-in">
      <Header title="Meu Perfil" subtitle="Gerencia sua conta" />

      {message.text && (
        <div className={`alert alert-${message.type} profile-alert`}>{message.text}</div>
      )}

      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-hero-info">
          <h2>{user?.nome}</h2>
          <p>{user?.email}</p>
          <span className={`badge ${isPlayer ? 'badge-aberto' : 'badge-finalizado'}`}>
            {isPlayer ? 'Jogador' : 'Administrador'}
          </span>
        </div>
        {isPlayer && (
          <div className="profile-balance-card">
            <span className="balance-label">Saldo Fictício</span>
            <span className="balance-value">R$ {Number(user?.saldo).toFixed(2)}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={refreshUser}>
              ↻ Atualizar
            </button>
          </div>
        )}
      </div>

      <nav className="profile-tabs">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </nav>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="profile-grid animate-fade-up">
            {isPlayer ? (
              <>
                <Card title="Estatísticas" className="profile-stat-card">
                  <div className="mini-stats">
                    <div className="mini-stat">
                      <span className="mini-stat-value">{bets.length}</span>
                      <span className="mini-stat-label">Apostas</span>
                    </div>
                    <div className="mini-stat success">
                      <span className="mini-stat-value">{wonBets}</span>
                      <span className="mini-stat-label">Ganhas</span>
                    </div>
                    <div className="mini-stat danger">
                      <span className="mini-stat-value">{lostBets}</span>
                      <span className="mini-stat-label">Perdidas</span>
                    </div>
                    <div className="mini-stat warning">
                      <span className="mini-stat-value">{pendingBets}</span>
                      <span className="mini-stat-label">Pendentes</span>
                    </div>
                  </div>
                  <p className="profile-meta">
                    Total apostado: <strong>R$ {totalWagered.toFixed(2)}</strong>
                  </p>
                </Card>

              </>
            ) : (
              <Card title="Painel Administrativo">
                <p className="profile-meta">Você tem acesso total ao gerenciamento da plataforma.</p>
                <div className="quick-links">
                  <Link to="/admin/events" className="quick-link">Gerenciar Eventos</Link>
                  <Link to="/admin/users" className="quick-link">Gerenciar Usuários</Link>
                </div>
              </Card>
            )}

            <Card title="Informações da Conta">
              <ul className="info-list">
                <li><span>ID</span><strong>{user?.id}</strong></li>
                <li><span>Nome</span><strong>{user?.nome}</strong></li>
                <li><span>E-mail</span><strong>{user?.email}</strong></li>
                <li><span>Perfil</span><strong>{isPlayer ? 'Jogador' : 'Administrador'}</strong></li>
                {isPlayer && (
                  <li><span>Saldo</span><strong>R$ {Number(user?.saldo).toFixed(2)}</strong></li>
                )}
              </ul>
            </Card>
          </div>
        )}

        {activeTab === 'account' && (
          <Card title="Editar Dados Pessoais" className="profile-form-card animate-fade-up">
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label htmlFor="nome">Nome de usuário</label>
                <input
                  id="nome"
                  className={`form-input ${profileErrors.nome ? 'input-error' : ''}`}
                  value={profileForm.nome}
                  onChange={(e) => setProfileForm({ ...profileForm, nome: e.target.value })}
                  maxLength={80}
                />
                <FieldError message={profileErrors.nome} />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${profileErrors.email ? 'input-error' : ''}`}
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
                <FieldError message={profileErrors.email} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card title="Alterar Senha" className="profile-form-card animate-fade-up">
            <p className="profile-meta">Use uma senha segura com pelo menos 3 caracteres.</p>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="senhaAtual">Senha atual</label>
                <input
                  id="senhaAtual"
                  type="password"
                  className={`form-input ${passwordErrors.senhaAtual ? 'input-error' : ''}`}
                  value={passwordForm.senhaAtual}
                  onChange={(e) => setPasswordForm({ ...passwordForm, senhaAtual: e.target.value })}
                />
                <FieldError message={passwordErrors.senhaAtual} />
              </div>
              <div className="form-group">
                <label htmlFor="novaSenha">Nova senha</label>
                <input
                  id="novaSenha"
                  type="password"
                  className={`form-input ${passwordErrors.novaSenha ? 'input-error' : ''}`}
                  value={passwordForm.novaSenha}
                  onChange={(e) => setPasswordForm({ ...passwordForm, novaSenha: e.target.value })}
                />
                <FieldError message={passwordErrors.novaSenha} />
              </div>
              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar nova senha</label>
                <input
                  id="confirmarSenha"
                  type="password"
                  className={`form-input ${passwordErrors.confirmarSenha ? 'input-error' : ''}`}
                  value={passwordForm.confirmarSenha}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmarSenha: e.target.value })}
                />
                <FieldError message={passwordErrors.confirmarSenha} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </form>
          </Card>
        )}

        {activeTab === 'wallet' && isPlayer && (
          <div className="wallet-center animate-fade-up">
            <Card title="Operações">
              <form onSubmit={handleWallet}>
                <div className="wallet-type-toggle">
                  <button
                    type="button"
                    className={`wallet-type-btn ${walletForm.tipo === 'saque' ? 'active' : ''}`}
                    onClick={() => setWalletForm({ ...walletForm, tipo: 'saque', valor: '' })}
                  >
                    Sacar
                  </button>
                  <button
                    type="button"
                    className={`wallet-type-btn ${walletForm.tipo === 'deposito' ? 'active' : ''}`}
                    onClick={() => setWalletForm({ ...walletForm, tipo: 'deposito', valor: '' })}
                  >
                    Depositar
                  </button>
                </div>
                <div className="form-group">
                  <label htmlFor="valor">
                    Valor (R$) — {walletForm.tipo === 'saque' ? 'mín. R$ 10' : 'crédito fictício'}
                  </label>
                  <input
                    id="valor"
                    type="number"
                    className={`form-input ${walletError ? 'input-error' : ''}`}
                    min="1"
                    step="1"
                    value={walletForm.valor}
                    onChange={(e) => {
                      setWalletForm({ ...walletForm, valor: e.target.value.replace(/[^0-9]/g, '') });
                      setWalletError('');
                    }}
                    placeholder="Ex: 100"
                  />
                  {walletError && <span className="form-error">{walletError}</span>}
                </div>
                <button
                  type="submit"
                  className={`btn btn-block ${walletForm.tipo === 'saque' ? 'btn-danger' : 'btn-success'}`}
                  disabled={saving}
                >
                  {saving ? 'Processando...' : walletForm.tipo === 'saque' ? 'Confirmar Saque Fictício' : 'Confirmar Depósito Fictício'}
                </button>
              </form>
            </Card>
          </div>
        )}

        {activeTab === 'extract' && isPlayer && (
          <div className="animate-fade-up">
            <Card title="Extrato de Movimentações">
              {transactions.length === 0 ? (
                <div className="empty-state compact">
                  <p>Nenhuma movimentação registrada ainda.</p>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveTab('wallet')}>
                    Fazer primeira operação
                  </button>
                </div>
              ) : (
                <Table columns={[
                  { key: 'data', label: 'Data' },
                  { key: 'tipo', label: 'Tipo' },
                  { key: 'descricao', label: 'Descrição' },
                  { key: 'valor', label: 'Valor' },
                  { key: 'status', label: 'Status' }
                ]}>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.data}</td>
                      <td>
                        <span className={`badge ${tx.tipo === 'deposito' ? 'badge-ganhou' : 'badge-perdeu'}`}>
                          {tx.tipo === 'deposito' ? 'Depósito' : 'Saque'}
                        </span>
                      </td>
                      <td>{tx.descricao}</td>
                      <td className={tx.tipo === 'deposito' ? 'text-success' : 'text-danger'}>
                        {tx.tipo === 'deposito' ? '+' : '-'} R$ {Number(tx.valor).toFixed(2)}
                      </td>
                      <td><span className="badge badge-finalizado">{tx.status}</span></td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
