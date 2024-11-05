import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import "./TransactionForm.css";

const TransactionForm = () => {
  const [type, setType] = useState("Receita");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  // Recuperar o userId do usuário logado
  useEffect(() => {
    const fetchUserId = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
        console.log("User ID encontrado:", currentUser.uid);
      } else {
        console.log("Nenhum usuário logado.");
        setMessage("Erro: usuário não logado.");
      }
    };

    fetchUserId();

    // Listener para atualizar o userId em caso de mudanças de login
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        console.log("User ID atualizado:", user.uid);
      } else {
        setUserId(null);
        setMessage("Erro: usuário não logado.");
      }
    });

    return () => unsubscribe(); // Cleanup do listener
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !date) {
      setMessage("Por favor, preencha todos os campos.");
      return;
    }

    if (!userId) {
      setMessage("Erro: Usuário não encontrado. Faça login para adicionar transações.");
      return;
    }

    try {
      console.log("Tipo de transação a ser salva:", type); // Log para verificar o tipo de transação
      console.log("User ID a ser enviado:", userId); // Verificar o userId antes de salvar

      await addDoc(collection(db, "transactions"), {
        type,
        description,
        amount: parseFloat(amount),
        date,
        userId, // Adicionando o userId para associar a transação ao usuário
      });

      setMessage(`Transação de ${type} adicionada com sucesso!`);
      setDescription("");
      setAmount("");
      setDate("");
      setType("Receita"); // Reset para Receita após submissão
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      setMessage("Erro ao adicionar transação.");
    }
  };

  return (
    <div className="transaction-form-container">
      <h2>Cadastrar Transação</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="transaction-form">
        <label>
          Tipo:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
        </label>
        <label>
          Descrição:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Valor:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Data:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={!userId}> {/* Botão desabilitado se userId não estiver disponível */}
          Adicionar Transação
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
