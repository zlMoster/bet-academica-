import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import Loading from './components/Loading/Loading';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  return (
    <div className="app-container">
      {user && <Navbar />}
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
