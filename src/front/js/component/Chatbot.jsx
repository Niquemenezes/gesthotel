import React, { useState } from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setConversation((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setConversation((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setConversation((prev) => [...prev, {
          role: "assistant",
          content: " Error al procesar la respuesta del asistente."
        }]);
        if (data.error) setError(data.error);
      }
    } catch (err) {
      setError(" Error de conexión con el servidor.");
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <h2 className="mb-4"> Asistente Técnico de Mantenimiento</h2>

      <div className="chat-box">
        {conversation.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            <strong>{msg.role === "user" ? "Tú" : "Bot"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="chat-msg assistant">Escribiendo...</div>}
      </div>

      <div className="chat-input mt-3">
        <input
          type="text"
          placeholder="Escribe una consulta técnica..."
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <button className="btn btn-primary mt-2 w-100" onClick={sendMessage} disabled={loading}>
          Enviar
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <style>{`
        .chat-container { max-width: 600px; margin: auto; padding: 1rem; }
        .chat-box {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 1rem;
          height: 300px;
          overflow-y: auto;
          background: #f9f9f9;
        }
        .chat-msg {
          margin-bottom: 0.5rem;
        }
        .chat-msg.user {
          text-align: right;
        }
        .chat-msg.assistant {
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
