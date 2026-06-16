import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerService } from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerService(formData);
      alert('Cadastro realizado! Faça login para continuar.');
      navigate('/login');
    } catch {
      setError('Erro ao cadastrar. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Criar Conta</h2>
        <p className="auth-subtitle">Cadastre-se e receba R$ 1.000 em saldo fictício</p>

        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              className="form-input"
              placeholder="Seu nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="form-input"
              placeholder="••••••"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Registrar'}
          </button>
        </form>

        <p className="auth-link">
          Já tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
