// components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { auth } from "../../services/firebase"; // Importando o auth do Firebase
import { useEffect, useState } from "react";
import Header from "../Header";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Verifica se o usuário está autenticado
      setLoading(false); // Atualiza o estado de loading
    });

    return () => unsubscribe(); // Limpa o listener
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Ou um componente de carregamento
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redireciona para a página de login se não estiver autenticado
  }

  // Renderiza o Header e o conteúdo protegido se o usuário estiver autenticado
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PrivateRoute;
