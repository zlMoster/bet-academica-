import api from './api';

export const loginService = async (email, senha) => {
  const { data } = await api.get('/users', { params: { email, senha } });
  if (data.length > 0) return data[0];
  throw new Error('Usuário não encontrado');
};

export const registerService = async (userData) => {
  const { data } = await api.post('/users', {
    ...userData,
    perfil: 'user',
    saldo: 1000
  });
  return data;
};
