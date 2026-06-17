import { eventCrud } from './crudService';

export const getEvents = () => eventCrud.getAll();

export const getEventById = (id) => eventCrud.getById(id);

export const createEvent = (eventData) => eventCrud.create(eventData);

export const updateEvent = (id, eventData) => eventCrud.update(id, eventData);

export const updateEventStatus = (id, status) => eventCrud.update(id, { status });

export const deleteEvent = (id) => eventCrud.remove(id);

export const informResult = (id, resultado) =>
  eventCrud.update(id, { resultado, status: 'finalizado' });
