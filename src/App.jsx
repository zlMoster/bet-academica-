import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Layout from './components/Layout/Layout';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import Loading from './components/Loading/Loading';

function App() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loading />;

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (!user || isAuthPage) {
    return (
      <div className="app-container">
        <main><AppRoutes /></main>
      </div>
    );
  }

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
