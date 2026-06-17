import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Layout from './components/Layout/Layout';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import Loading from './components/Loading/Loading';

function App() {
  // Puxa o estado do usuário e a flag de carregamento inicial para travar as rotas enquanto valida o token/sessão
  const { user, loading } = useContext(AuthContext);
  
  // Hook para monitorar qual rota/URL o usuário está tentando acessar no momento
  const location = useLocation();

  // Exibe a tela de carregamento (Spinner) enquanto o Context API verifica se há um usuário logado
  if (loading) return <Loading />;

  // Identifica se a URL atual corresponde às páginas de autenticação (Login ou Cadastro)
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  /* FLUXO EXTERNO: Se o usuário não estiver logado OU se ele estiver especificamente nas páginas 
    de Login/Cadastro, renderiza as rotas limpas na tela, sem o menu lateral ou cabeçalho fixo.
  */
  if (!user || isAuthPage) {
    return (
      <div className="app-container">
        <main><AppRoutes /></main>
      </div>
    );
  }

  /* FLUXO INTERNO (SISTEMA LOGADO): Renderiza a estrutura global do painel.
    O componente <Layout> injeta a nossa Sidebar na lateral esquerda e empurra o conteúdo 
    dinâmico das páginas (<AppRoutes />) perfeitamente para a direita da tela.
  */
  return (
    <div className="app-container">
      <Navbar />
      <Layout>
        <AppRoutes />
      </Layout>
      <Footer />
    </div>
  );
}

export default App;