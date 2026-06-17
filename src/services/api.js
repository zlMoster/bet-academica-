import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('API network error:', error.message, error.config && error.config.url);
      const target = (error.config && error.config.url) || api.defaults.baseURL;
      return Promise.reject(
        new Error(`Servidor indisponível em ${target}. Execute "npm run server" para iniciar o JSON server. Detalhe: ${error.message}`)
      );
    }
    return Promise.reject(error);
  }
);

export default api;
