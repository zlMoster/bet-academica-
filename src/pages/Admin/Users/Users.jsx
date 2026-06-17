import { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Loading from '../../../components/Loading/Loading';
import Table from '../../../components/Table/Table';
import { getUsers, deleteUser, updateUserBalance } from '../../../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [balanceEdits, setBalanceEdits] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingBalanceId, setSavingBalanceId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setError('');
    setSuccess('');
    try {
      const { data } = await getUsers();
      setUsers(data);
      setBalanceEdits(
        data.reduce((acc, user) => {
          acc[user.id] = user.saldo ?? 0;
          return acc;
        }, {})
      );
    } catch {
      setError('Erro ao carregar usuários. Verifique o servidor.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir este usuário?')) return;
    try {
      await deleteUser(id);
      await loadUsers();
      setSuccess('Usuário excluído com sucesso.');
    } catch {
      setError('Não foi possível remover o usuário.');
    }
  };

  const handleBalanceChange = (id, value) => {
    setBalanceEdits((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveBalance = async (id) => {
    setError('');
    setSuccess('');
    const newValue = Number(balanceEdits[id]);
    if (Number.isNaN(newValue) || newValue < 0) {
      setError('Saldo inválido. Insira um valor numérico igual ou maior que zero.');
      return;
    }

    setSavingBalanceId(id);
    try {
      await updateUserBalance(id, newValue);
      await loadUsers();
      setSuccess('Saldo atualizado com sucesso.');
    } catch {
      setError('Erro ao atualizar o saldo. Tente novamente.');
    } finally {
      setSavingBalanceId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page-content animate-fade-in">
      <Header title="Gerenciar Usuários" subtitle="Visualize e gerencie todas as contas cadastradas." />

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-wrapper animate-fade-up" style={{ animationDelay: '120ms' }}>
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'nome', label: 'Nome' },
            { key: 'email', label: 'E-mail' },
            { key: 'perfil', label: 'Perfil' },
            { key: 'saldo', label: 'Saldo' },
            { key: 'acoes', label: 'Ações' }
          ]}
        >
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.perfil}</td>
              <td>
                <div className="user-balance-edit">
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={balanceEdits[user.id] ?? 0}
                    onChange={(e) => handleBalanceChange(user.id, e.target.value)}
                  />
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSaveBalance(user.id)}
                    disabled={savingBalanceId === user.id}
                  >
                    {savingBalanceId === user.id ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default Users;
