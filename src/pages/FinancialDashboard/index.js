// src/pages/FinancialDashboard.js
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import Header from "../../components/Header"; // Importando o Header
import "./FinancialDashboard.css";

const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedTransactions);

      // Filtra e calcula receitas e despesas
      const income = fetchedTransactions
        .filter((transaction) => transaction.type === "Receita")
        .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
      const expenses = fetchedTransactions
        .filter((transaction) => transaction.type === "Despesa")
        .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);

      setIncomeTotal(income);
      setExpenseTotal(expenses);
      setBalance(income - expenses);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="dashboard-container">
      <Header /> {/* Adiciona o Header ao topo */}
      <h2>Dashboard Financeiro</h2>

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
            {transactions.map((transaction) => (
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
