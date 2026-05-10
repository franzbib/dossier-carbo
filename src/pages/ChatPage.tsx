import { FormEvent, useState } from "react";
import type { ChatMessage } from "../types";

const suggestions = [
  "Que sait-on de Clément Carbonnier ?",
  "Quelles accusations apparaissent dans les documents ?",
  "Quelle chronologie peut-on établir ?",
  "Quels points doivent être vérifiés ?",
  "Quels documents mentionnent PIGUET ou BERGEON ?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Posez une question sur la base. Je répondrai uniquement à partir des extraits disponibles et je citerai les documents utilisés.",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    setQuestion("");
    setError(null);
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l’interrogation de la base.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer || "Aucune réponse." },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Je n’ai pas pu interroger la base pour le moment. Vérifiez la configuration de l’API ou réessayez plus tard.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit(question);
  }

  return (
    <section className="chat-page">
      <p className="eyebrow">Interroger la base</p>
      <h1>Assistant d’exploration</h1>
      <div className="suggestions" aria-label="Questions suggérées">
        {suggestions.map((item) => (
          <button key={item} onClick={() => void submit(item)} disabled={loading}>
            {item}
          </button>
        ))}
      </div>
      <div className="chat-window">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
              <p>{message.content}</p>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <p>Recherche dans les extraits pertinents…</p>
            </div>
          )}
        </div>
        {error && <p className="status error">{error}</p>}
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Votre question sur les archives…"
            maxLength={800}
          />
          <button type="submit" disabled={loading || !question.trim()}>
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
}
