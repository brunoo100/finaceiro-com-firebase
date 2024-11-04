import { db, auth } from "../../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css'
export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login: " + error.message);
    }
  }

  return (
    <div className="container">
      <div className="area-1"></div>
      <div className="area-2">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" className="botao-link">
            Login
          </button>
          <p>Não possui conta? <Link to="/cadastro">Cadastre-se</Link></p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
