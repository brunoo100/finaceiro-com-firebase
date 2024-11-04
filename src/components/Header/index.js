// src/components/Header.js
import { Link } from "react-router-dom";
import { auth } from "../../services/firebase";
import { FaHome, FaChartLine, FaMoneyCheckAlt, FaUserCircle, FaSignOutAlt } from "react-icons/fa"; 
import TransactionForm from "../../pages/TransactionForm";
import './header.css';

const Header = () => {
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <header className="sidebar">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/home" className="nav-link">
              <FaHome className="nav-icon" /> <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/financial-dashboard" className="nav-link">
              <FaChartLine className="nav-icon" /> <span>Relatórios</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/transactions" className="nav-link">
              <FaMoneyCheckAlt className="nav-icon" /> <span>Transações</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              <FaUserCircle className="nav-icon" /> <span>Perfil</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" onClick={handleLogout} className="nav-link">
              <FaSignOutAlt className="nav-icon" /> <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
