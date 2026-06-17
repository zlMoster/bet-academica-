import api from './api';

export const createCrudService = (resource) => ({
  getAll: (params = {}) => api.get(`/${resource}`, { params }),
  getById: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.patch(`/${resource}/${id}`, data),
  remove: (id) => api.delete(`/${resource}/${id}`)
});

export const userCrud = createCrudService('users');
export const eventCrud = createCrudService('events');
export const betCrud = createCrudService('bets');
export const transactionCrud = createCrudService('transactions');
