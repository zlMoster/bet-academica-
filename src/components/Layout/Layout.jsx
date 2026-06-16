import Sidebar from '../Sidebar/Sidebar';

const Layout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="layout-content">{children}</div>
  </div>
);

export default Layout;
