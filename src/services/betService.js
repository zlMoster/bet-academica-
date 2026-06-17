import { betCrud } from './crudService';
import { getUserById, updateUserBalance } from './userService';

export const placeBet = (betData) => betCrud.create(betData);

export const getBetsByUserAndEvent = async (eventId, userId) => {
  const { data } = await betCrud.getAll({ eventId, userId });
  return { data };
};

export const getHistory = async (userId) => {
  const { data } = await betCrud.getAll();
  const filtered = data.filter((bet) => String(bet.userId) === String(userId));
  return { data: filtered };
};

export const getBetsByEvent = async (eventId) => {
  const { data } = await betCrud.getAll();
  const filtered = data.filter((bet) => String(bet.eventId) === String(eventId));
  return { data: filtered };
};

export const updateBet = (id, data) => betCrud.update(id, data);

export const getAllBets = () => betCrud.getAll();

export const deleteBet = (id) => betCrud.remove(id);

export const resolveBetsForEvent = async (eventId, resultado) => {
  const { data: bets } = await getBetsByEvent(eventId);
  const updatedUserIds = [];

  for (const bet of bets) {
    if (bet.status !== 'pendente') continue;

    const won = bet.palpite === resultado;
    const newStatus = won ? 'ganhou' : 'perdeu';
    const retorno = won ? Number(bet.valor) * Number(bet.odd) : 0;

    await betCrud.update(bet.id, { status: newStatus, retorno });

    if (won) {
      const { data: user } = await getUserById(String(bet.userId));
      const novoSaldo = Number(user.saldo) + retorno;
      await updateUserBalance(String(bet.userId), novoSaldo);
      updatedUserIds.push(String(bet.userId));
    }
  }

  return updatedUserIds;
};
