import './Header.css';

const Header = ({ title, subtitle }) => {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </header>
  );
};

export default Header;
