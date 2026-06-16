import api from './api';

export const getUsers = () => api.get('/users');

export const getUserById = (id) => api.get(`/users/${id}`);

export const updateUserBalance = (id, saldo) => api.patch(`/users/${id}`, { saldo });

export const getRanking = () =>
  api.get('/users?perfil=user&_sort=saldo&_order=desc');
