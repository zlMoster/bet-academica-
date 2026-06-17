import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { loginService } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.registered
    ? 'Cadastro realizado! Faça login para continuar.'
    : '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginService(email, senha);
      login(user);
      navigate(user.perfil === 'admin' ? '/admin/events' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciais inválidas. Tente novamente.');
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
        <h2>G2XBet</h2>
        <p className="auth-subtitle">Maior plataforma de apostas do Brasil.</p>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link">
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>

        <div className="auth-demo-box">
          <strong>Contas de teste:</strong>
          <span>Admin: admin@bet.com / 123</span>
          <span>Jogador: user@bet.com / 123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
