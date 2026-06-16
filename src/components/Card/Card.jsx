const Card = ({ title, description, children, className = '' }) => (
  <div className={`card ${className}`}>
    {title && <h4 style={{ color: 'var(--blue-dark)', marginBottom: '0.5rem' }}>{title}</h4>}
    {description && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{description}</p>}
    {children}
  </div>
);

export default Card;
