import React, { useState } from "react";
import "../../styles/chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: "Error al procesar la respuesta del asistente." },
        ]);
        if (data.error) setError(data.error);
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {isOpen ? (
        <div className="card p-3 shadow chatbot-card">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-robot text-primary me-2"></i> Mantenito
            </h5>
            <button className="btn btn-sm btn-danger" onClick={() => setIsOpen(false)}>
              X
            </button>
          </div>
          <p className="text-muted small mt-2">
            ¿Tienes dudas con alguna incidencia? Mantenito está aquí para ayudarte.
          </p>

          <div className="chat-box mt-2">
            {conversation.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <strong>{msg.role === "user" ? "Tú" : "Mantenito"}:</strong> {msg.content}
              </div>
            ))}
            {loading && <div className="chat-msg assistant">Mantenito está pensando...</div>}
          </div>

          <input
            type="text"
            placeholder="Escribe tu consulta..."
            className="form-control mt-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <button
            className="btn btn-primary w-100 mt-2"
            onClick={sendMessage}
            disabled={loading}
          >
            Enviar
          </button>

          {error && <div className="alert alert-danger mt-2">{error}</div>}

          
        </div>
      ) : (
        <button
          className="btn btn-primary rounded-circle p-3 shadow"
          style={{ width: "60px", height: "60px" }}
          onClick={() => setIsOpen(true)}
        >
          🤖
        </button>
      )}
    </div>
  );
};

export default Chatbot;
