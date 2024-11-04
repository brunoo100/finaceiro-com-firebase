// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Header from "../../components/Header";
import "./Profile.css";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email); // Define o e-mail do usuário autenticado
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserName(userSnap.data().nome); // Usa o campo "nome" do Firestore
          setNewName(userSnap.data().nome); // Define o campo de edição com o nome atual
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          nome: newName,
        });
        setUserName(newName);
        setMessage("Nome atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar o nome:", error);
        setMessage("Erro ao atualizar o nome. Tente novamente.");
      }
    }
  };

  return (
    <div className="profile-container">
      <Header />
      <div className="profile-content">
        <h2>Perfil do Usuário</h2>
        {message && <p className="message">{message}</p>}
        
        <div className="profile-info">
          <p><strong>Nome:</strong> {userName}</p>
          <p><strong>Email:</strong> {userEmail}</p>
        </div>

        <form onSubmit={handleUpdate} className="profile-form">
          <label>
            Editar Nome:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </label>
          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
