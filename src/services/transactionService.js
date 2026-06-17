import { transactionCrud } from './crudService';
import { getUserById, updateUserBalance } from './userService';

export const getTransactionsByUser = async (userId) => {
  const { data } = await transactionCrud.getAll();
  const filtered = data
    .filter((t) => String(t.userId) === String(userId))
    .sort((a, b) => new Date(b.data) - new Date(a.data));
  return { data: filtered };
};

export const createTransaction = (data) => transactionCrud.create(data);

export const createWithdraw = async (userId, valor) => {
  const amount = Number(valor);
  const { data: user } = await getUserById(userId);

  if (amount <= 0) throw new Error('Valor de saque inválido.');
  if (amount > Number(user.saldo)) throw new Error('Saldo insuficiente para saque.');

  const novoSaldo = Number(user.saldo) - amount;
  await updateUserBalance(userId, novoSaldo);

  const { data: tx } = await transactionCrud.create({
    userId,
    tipo: 'saque',
    valor: amount,
    descricao: 'Saque fictício',
    status: 'concluido',
    data: new Date().toISOString().split('T')[0]
  });

  return { transaction: tx, novoSaldo };
};

export const createDeposit = async (userId, valor) => {
  const amount = Number(valor);
  const { data: user } = await getUserById(userId);

  if (amount <= 0) throw new Error('Valor de depósito inválido.');

  const novoSaldo = Number(user.saldo) + amount;
  await updateUserBalance(userId, novoSaldo);

  const { data: tx } = await transactionCrud.create({
    userId,
    tipo: 'deposito',
    valor: amount,
    descricao: 'Depósito fictício',
    status: 'concluido',
    data: new Date().toISOString().split('T')[0]
  });

  return { transaction: tx, novoSaldo };
};

export const deleteTransaction = (id) => transactionCrud.remove(id);
