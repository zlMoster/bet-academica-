import React from 'react';
import Sidebar from '/src/Components/Sidebar/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* 1. Sidebar fixa na lateral esquerda */}
      <Sidebar />

      {/* 2. Área do conteúdo empurrada corretamente */}
      <main 
        className="flex-grow-1 p-4" 
        style={{ 
          marginLeft: '240px',     /* Abre espaço para a Sidebar */
          paddingTop: '84px',      /* IMPORTANTE: Abre espaço para a Navbar fixed não cobrir o topo da página */
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        <div className="container-fluid">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;