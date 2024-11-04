// components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { auth } from "../../services/firebase"; // Importando o auth do Firebase
import { useEffect, useState } from "react";

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

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
