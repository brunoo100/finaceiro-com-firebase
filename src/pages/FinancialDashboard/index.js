// src/pages/FinancialDashboard.js
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import Header from "../../components/Header"; // Importando o Header
import "./FinancialDashboard.css";

const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual por padrão

  useEffect(() => {
    const fetchTransactions = async () => {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedTransactions);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filtrar as transações pelo mês selecionado
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() + 1 === selectedMonth;
    });
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
  }, [transactions, selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  return (
    <div className="dashboard-container">
      <Header /> {/* Adiciona o Header ao topo */}
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
