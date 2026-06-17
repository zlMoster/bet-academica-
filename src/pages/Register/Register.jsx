import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerService } from '../../services/authService';
import { validateEmail } from '../../components/utils/validators';

const Register = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      nome: formData.nome.trim(),
      email: formData.email.trim().toLowerCase(),
      senha: formData.senha
    };

    if (payload.nome.length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres.');
      setLoading(false);
      return;
    }

    const emailError = validateEmail(payload.email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    if (payload.senha.length < 3) {
      setError('A senha deve ter pelo menos 3 caracteres.');
      setLoading(false);
      return;
    }

    try {
      await registerService(payload);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes" aria-hidden="true">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>
      <div className="auth-card animate-scale-in">
        <div className="auth-logo" aria-hidden="true"></div>
        <h2>Criar Conta</h2>
        <p className="auth-subtitle">Cadastre-se e receba R$ 1.000 em saldo fictício</p>

        {error && <div className="alert alert-danger">{error}</div>}

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
              minLength={3}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
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
