// src/pages/TransactionForm.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./TransactionForm.css";
import Header from "../../components/Header";

const TransactionForm = () => {
  const [type, setType] = useState("Receita");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !date) {
      setMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await addDoc(collection(db, "transactions"), {
        type,
        description,
        amount: parseFloat(amount),
        date,
      });
      setMessage("Transação adicionada com sucesso!");
      setDescription("");
      setAmount("");
      setDate("");
      setType("Receita");
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      setMessage("Erro ao adicionar transação.");
    }
  };

  return (
    <div className="transaction-form-container">
        <Header />
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
        <button type="submit">Adicionar Transação</button>
      </form>
    </div>
  );
};

export default TransactionForm;
