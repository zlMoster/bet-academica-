import api from './api';
import { getUserById, updateUserBalance } from './userService';

export const placeBet = (betData) => api.post('/bets', betData);

export const getHistory = (userId) => api.get(`/bets?userId=${userId}`);

export const getBetsByEvent = (eventId) => api.get(`/bets?eventId=${eventId}`);

export const updateBet = (id, data) => api.patch(`/bets/${id}`, data);

export const getAllBets = () => api.get('/bets');

export const resolveBetsForEvent = async (eventId, resultado) => {
  const { data: bets } = await getBetsByEvent(eventId);

  for (const bet of bets) {
    if (bet.status !== 'pendente') continue;

    const won = bet.palpite === resultado;
    const newStatus = won ? 'ganhou' : 'perdeu';
    await updateBet(bet.id, { status: newStatus });

    if (won) {
      const { data: user } = await getUserById(bet.userId);
      const novoSaldo = Number(user.saldo) + Number(bet.valor) * Number(bet.odd);
      await updateUserBalance(bet.userId, novoSaldo);
    }
  }
};
