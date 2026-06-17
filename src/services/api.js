import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error('Servidor indisponível. Execute "npm run server" para iniciar o JSON server.')
      );
    }
    return Promise.reject(error);
  }
);

export default api;
