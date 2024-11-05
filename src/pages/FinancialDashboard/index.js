import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { getAuth } from "firebase/auth"; // Importando o Firebase Authentication
import "./FinancialDashboard.css";

const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual por padrão
  const [user, setUser] = useState(null); // Para armazenar o usuário logado

  // Recuperando o usuário logado
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser; // Pega o usuário logado
    if (currentUser) {
      setUser(currentUser); // Define o usuário logado
      console.log("Usuário logado:", currentUser); // Verifique o usuário logado
    } else {
      console.log("Nenhum usuário logado"); // Se não houver usuário logado
    }
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        console.log("Usuário não logado, abortando busca de transações");
        return; // Se não houver um usuário logado, não faz a busca
      }

      console.log("Buscando transações para o usuário:", user.uid); // Verifique o UID

      const userTransactionsQuery = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid) // Filtrando transações pelo UID do usuário
      );

      const querySnapshot = await getDocs(userTransactionsQuery);
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Transações recuperadas:", fetchedTransactions); // Verifique as transações recuperadas

      setTransactions(fetchedTransactions);
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    if (transactions.length === 0) {
      console.log("Nenhuma transação encontrada para o usuário");
    } else {
      // Filtrar as transações pelo mês selecionado
      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() + 1 === selectedMonth;
      });

      console.log("Transações filtradas por mês:", filtered); // Verifique as transações filtradas

      setFilteredTransactions(filtered);

      // Calcular receitas e despesas para o mês filtrado
      const income = filtered
        .filter((transaction) => transaction.type === "Receita")
        .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
      const expenses = filtered
        .filter((transaction) => transaction.type === "Despesa")
        .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);

      setIncomeTotal(income);
      setExpenseTotal(expenses);
      setBalance(income - expenses);
    }
  }, [transactions, selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  if (!user) {
    return <div>Carregando...</div>; // Ou algum tipo de loader ou mensagem de erro
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard Financeiro</h2>

      {/* Filtro de mês */}
      <div className="month-filter">
        <label>Filtrar por mês:</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="1">Janeiro</option>
          <option value="2">Fevereiro</option>
          <option value="3">Março</option>
          <option value="4">Abril</option>
          <option value="5">Maio</option>
          <option value="6">Junho</option>
          <option value="7">Julho</option>
          <option value="8">Agosto</option>
          <option value="9">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>
      </div>

      {/* Cartões de resumo */}
      <div className="summary-cards">
        <div className="card income-card">
          <h3>Receita</h3>
          <p>R$ {incomeTotal.toFixed(2)}</p>
        </div>
        <div className="card expense-card">
          <h3>Despesa</h3>
          <p>R$ {expenseTotal.toFixed(2)}</p>
        </div>
        <div className={`card balance-card ${balance >= 0 ? "positive" : "negative"}`}>
          <h3>Saldo</h3>
          <p>R$ {balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabela de transações */}
      <div className="transactions-table">
        <h3>Detalhes das Transações</h3>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.type}</td>
                <td>R$ {parseFloat(transaction.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialDashboard;
