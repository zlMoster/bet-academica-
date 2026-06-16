import api from './api';

export const getEvents = () => api.get('/events');

export const getEventById = (id) => api.get(`/events/${id}`);

export const createEvent = (eventData) => api.post('/events', eventData);

export const updateEvent = (id, eventData) => api.patch(`/events/${id}`, eventData);

export const updateEventStatus = (id, status) => api.patch(`/events/${id}`, { status });

export const deleteEvent = (id) => api.delete(`/events/${id}`);

export const informResult = (id, resultado) =>
  api.patch(`/events/${id}`, { resultado, status: 'finalizado' });
