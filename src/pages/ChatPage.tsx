import { FormEvent, useState } from "react";
import type { ChatMessage } from "../types";

const suggestions = [
  "Que sait-on de Clément Carbonnier d’après les documents ?",
  "Quels documents parlent du procès ?",
  "Quels noms reviennent le plus souvent ?",
  "Quelle chronologie peut-on établir pour le moment ?",
  "Quels points restent à vérifier ?",
  "Quels documents faudrait-il relire en priorité ?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Vous pouvez poser une question en langage simple. Je chercherai dans les documents indexés, en citant les sources utilisées et en signalant les incertitudes.",
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
        throw new Error(
          data.error ||
            "Le chat n’a pas réussi à répondre. Cela peut venir d’un problème temporaire de connexion ou de configuration.",
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer ||
            "Je n’ai pas trouvé assez d’éléments dans les extraits transmis pour répondre prudemment.",
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Le chat n’a pas réussi à répondre pour le moment.",
      );
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Le chat n’a pas réussi à répondre. Cela peut venir d’un problème temporaire de connexion ou de configuration.",
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
      <p className="eyebrow">Explorer ensemble</p>
      <h1>Poser une question aux archives</h1>
      <p className="page-intro">
        Vous pouvez poser une question en langage simple. Le chat cherchera dans
        la base et répondra uniquement à partir des documents indexés. S’il ne
        trouve pas d’élément suffisant, il le dira.
      </p>
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
              <p>Je cherche dans les documents indexés…</p>
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
