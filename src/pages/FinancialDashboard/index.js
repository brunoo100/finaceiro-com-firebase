import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import "./FinancialDashboard.css";

const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recuperando o usuário logado e seu userId
  useEffect(() => {
    const fetchUserId = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
        console.log("Usuário logado:", currentUser.uid);
      } else {
        console.log("Nenhum usuário logado");
      }
    };

    fetchUserId();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Recuperando transações para o userId
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        console.log("userId não encontrado, abortando busca de transações");
        setLoading(false);
        return;
      }

      console.log("Buscando transações para o userId:", userId);

      const userTransactionsQuery = query(
        collection(db, "transactions"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(userTransactionsQuery);
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Transações recuperadas:", fetchedTransactions);

      setTransactions(fetchedTransactions);
      setLoading(false);
    };

    fetchTransactions();
  }, [userId]);

  // Filtrando transações por mês e calculando totais
  useEffect(() => {
    if (transactions.length === 0) {
      console.log("Nenhuma transação encontrada para o usuário");
      setFilteredTransactions([]);
      setIncomeTotal(0);
      setExpenseTotal(0);
      setBalance(0);
      return;
    }

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() + 1 === selectedMonth;
    });

    console.log("Transações filtradas por mês:", filtered);

    setFilteredTransactions(filtered);

    // Calcular receitas e despesas para o mês filtrado
    const income = filtered
      .filter((transaction) => transaction.type.toLowerCase() === "receita")
      .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);

    const expenses = filtered
      .filter((transaction) => transaction.type.toLowerCase() === "despesa")
      .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);

    setIncomeTotal(income);
    setExpenseTotal(expenses);
    setBalance(income - expenses);

    console.log("Total de receita:", income);
    console.log("Total de despesa:", expenses);
  }, [transactions, selectedMonth]);

  // Função para mudar o mês
  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!userId) {
    return <div>Por favor, faça login para ver suas transações.</div>;
  }

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="dashboard-container">
      <h2>Dashboard Financeiro</h2>

      {/* Filtro de mês */}
      <div className="month-filter">
        <label>Filtrar por mês:</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
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
        {filteredTransactions.length === 0 ? (
          <p>Nenhuma transação encontrada para o mês selecionado.</p>
        ) : (
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
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.type}</td>
                  <td>R$ {parseFloat(transaction.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;
