import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {

  return (
    <div className="sidebar">

      <h4 className="text-center mb-4">
        Fantasy App
      </h4>

      <Link to="/dashboard">
        <i className="bi bi-speedometer2"></i>
        Dashboard
      </Link>

      <Link to="/ranking">
        <i className="bi bi-trophy-fill"></i>
        Ranking
      </Link>

      <Link to="/profile">
        <i className="bi bi-person-fill"></i>
        Perfil
      </Link>

      <Link to="/admin/users">
        <i className="bi bi-people-fill"></i>
        Usuários
      </Link>

    </div>
  );
}