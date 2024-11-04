// routes/RoutesApp.js
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import FinancialDashboard from "./pages/FinancialDashboard";
import TransactionForm from "./pages/TransactionForm";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute"; // Importando o componente PrivateRoute

export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/financial-dashboard"
          element={
            <PrivateRoute>
              <FinancialDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction-form"
          element={
            <PrivateRoute>
              <TransactionForm />
            </PrivateRoute>
          }
        />
        <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
          }
          />
      </Routes>
    </BrowserRouter>
  );
}
