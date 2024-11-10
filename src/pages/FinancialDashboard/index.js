import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
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
  const [editTransaction, setEditTransaction] = useState(null); // Estado para controlar a transação em edição

  // Recuperando o usuário logado e seu userId
  useEffect(() => {
    const fetchUserId = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
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
      if (!userId) return;

      const userTransactionsQuery = query(
        collection(db, "transactions"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(userTransactionsQuery);
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(fetchedTransactions);
      setLoading(false);
    };

    fetchTransactions();
  }, [userId]);

  // Filtrando transações por mês e calculando totais
  useEffect(() => {
    if (transactions.length === 0) return;

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() + 1 === selectedMonth;
    });

    setFilteredTransactions(filtered);

    const income = filtered
      .filter((transaction) => transaction.type.toLowerCase() === "receita")
      .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);

    const expenses = filtered
      .filter((transaction) => transaction.type.toLowerCase() === "despesa")
      .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);

    setIncomeTotal(income);
    setExpenseTotal(expenses);
    setBalance(income - expenses);
  }, [transactions, selectedMonth]);

  // Função para mudar o mês
  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  // Função para excluir uma transação
  const handleDeleteTransaction = async (transactionId) => {
    await deleteDoc(doc(db, "transactions", transactionId));
    setTransactions(transactions.filter((transaction) => transaction.id !== transactionId));
  };

  // Função para editar uma transação
  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction); // Preenche o estado com a transação que será editada
  };

  // Função para salvar a edição de uma transação
  const handleSaveEdit = async () => {
    const transactionRef = doc(db, "transactions", editTransaction.id);
    await updateDoc(transactionRef, {
      description: editTransaction.description,
      type: editTransaction.type,
      amount: editTransaction.amount,
    });

    setTransactions(transactions.map((transaction) =>
      transaction.id === editTransaction.id ? editTransaction : transaction
    ));
    setEditTransaction(null); // Limpa o estado de edição após salvar
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>
                    {editTransaction && editTransaction.id === transaction.id ? (
                      <input
                        type="text"
                        value={editTransaction.description}
                        onChange={(e) =>
                          setEditTransaction({ ...editTransaction, description: e.target.value })
                        }
                      />
                    ) : (
                      transaction.description
                    )}
                  </td>
                  <td>
                    {editTransaction && editTransaction.id === transaction.id ? (
                      <select
                        value={editTransaction.type}
                        onChange={(e) =>
                          setEditTransaction({ ...editTransaction, type: e.target.value })
                        }
                      >
                        <option value="receita">Receita</option>
                        <option value="despesa">Despesa</option>
                      </select>
                    ) : (
                      transaction.type
                    )}
                  </td>
                  <td>
                    {editTransaction && editTransaction.id === transaction.id ? (
                      <input
                        type="number"
                        value={editTransaction.amount}
                        onChange={(e) =>
                          setEditTransaction({ ...editTransaction, amount: e.target.value })
                        }
                      />
                    ) : (
                      `R$ ${parseFloat(transaction.amount).toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {editTransaction && editTransaction.id === transaction.id ? (
                      <>
                        <button onClick={handleSaveEdit}>Salvar</button>
                        <button onClick={() => setEditTransaction(null)}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-2" onClick={() => handleEditTransaction(transaction)}>Editar</button>
                        <button className="btn-2" onClick={() => handleDeleteTransaction(transaction.id)}>Excluir</button>
                      </>
                    )}
                  </td>
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
