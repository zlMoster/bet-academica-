const Card = ({ title, description, children, className = '', delay = 0 }) => (
  <div
    className={`card animate-fade-up ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {title && <h4 className="card-title">{title}</h4>}
    {description && <p className="card-description">{description}</p>}
    {children}
  </div>
);

export default Card;
