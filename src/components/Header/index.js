import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebase";
import { FaHome, FaChartLine, FaMoneyCheckAlt, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import './header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`header ${menuOpen ? 'menu-open' : ''}`}>
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className="menu-icon"></div>
        <div className="menu-icon"></div>
        <div className="menu-icon"></div>
      </div>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/home" className="nav-link" onClick={toggleMenu}>
              <FaHome className="nav-icon" /> <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/financial-dashboard" className="nav-link" onClick={toggleMenu}>
              <FaChartLine className="nav-icon" /> <span>Relatórios</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/transaction-form" className="nav-link" onClick={toggleMenu}>
              <FaMoneyCheckAlt className="nav-icon" /> <span>Transações</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link" onClick={toggleMenu}>
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
