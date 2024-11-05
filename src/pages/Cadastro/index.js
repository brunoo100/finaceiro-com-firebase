import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Certifique-se de que o CSS do Toastify está sendo importado

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const navigate = useNavigate();

  async function novoUsuario(e) {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      // Criação do usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Salvar os dados do usuário na coleção "users" com o uid como chave do documento
      await setDoc(doc(db, "users", user.uid), {
        nome: nome,
        email: email,
        // Adicionando o userId explicitamente (já é o uid do Firebase)
        userId: user.uid,
      });

      toast.success("Cadastro realizado com sucesso!");
      navigate("/home");

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("O email já está em uso. Por favor, utilize outro email.");
      } else {
        console.error("Erro ao cadastrar usuário:", error);
        toast.error("Erro ao cadastrar usuário: " + error.message);
      }
    }
  }

  return (
    <div className="container">
      <div className="area-1"></div>
      <div className="area-2">
        <form onSubmit={novoUsuario}>
          <h1>Cadastro</h1>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <label>Confirmar Senha:</label>
          <input
            type="password"
            placeholder="Confirmar sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />

          {/* Botão de submissão */}
          <button type="submit" className="botao-link">
            Cadastrar
          </button>

          <p>Já tem conta? <Link to="/">Login</Link></p>

        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
