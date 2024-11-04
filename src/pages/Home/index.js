// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../services/firebase"; // Importando o Firebase auth e db
import { doc, getDoc } from "firebase/firestore";
import Header from "../../components/Header"; // Importando o Header
import "./home.css";

const Home = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        // Referência ao documento do usuário no Firestore usando o uid
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // Se o documento existe, define o nome do usuário do Firestore
          setUserName(userSnap.data().nome); // Usa o campo "nome" do documento Firestore
        } else {
          // Caso o documento do usuário não exista, usa o displayName ou email do Firebase Auth
          setUserName(user.displayName || user.email);
        }
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="home-container">
      <Header /> {/* Adiciona o Header ao topo */}
      <div className="home-content">
        <h2>Bem-vindo, {userName}!</h2>
        <p>Gerencie suas finanças de forma prática e organizada.</p>

        <div className="navigation-cards">
          <Link to="/financial-dashboard" className="nav-card dashboard-card">
            <h3>Dashboard Financeiro</h3>
            <p>Veja um resumo de suas finanças.</p>
          </Link>

          <Link to="/profile" className="nav-card profile-card">
            <h3>Perfil</h3>
            <p>Altere as configurações da sua conta.</p>
          </Link>

          <Link
            to="/transaction-form"
            className="nav-card add-transaction-card"
          >
            <h3>Nova Transação</h3>
            <p>Adicione uma nova transação ao sistema.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
