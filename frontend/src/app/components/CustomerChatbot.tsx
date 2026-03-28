import { useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { api, getApiErrorMessage } from "../lib/api";
import { getStoredUser } from "../lib/session";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

interface AssistantChatResponse {
  reply: string;
}

interface CustomerChatbotProps {
  restaurantId?: string;
}

export default function CustomerChatbot({ restaurantId }: CustomerChatbotProps) {
  const user = getStoredUser();
  const isCustomer = user?.role === "CUSTOMER";

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! Ask me about your orders, delivery status, or top-rated restaurants.",
    },
  ]);

  const quickQuestions = useMemo(
    () => [
      "Where is my latest order?",
      "Which restaurants have good ratings?",
      "Suggest top rated food right now",
    ],
    [],
  );

  if (!isCustomer) {
    return null;
  }

  const sendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post<AssistantChatResponse>("/api/assistant/chat", {
        message: text,
        restaurantId: restaurantId || undefined,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: response.data.reply || "I could not find that information right now.",
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: getApiErrorMessage(err, "Assistant is currently unavailable."),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="h-14 w-14 rounded-full border border-cyan-400/50 bg-cyan-500/20 text-cyan-100 shadow-lg backdrop-blur hover:bg-cyan-500/30"
          aria-label="Open assistant"
        >
          <MessageCircle className="mx-auto h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="w-[92vw] max-w-sm rounded-2xl border border-white/10 bg-[#111111]/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Order Assistant</p>
              <p className="text-xs text-zinc-400">Powered by your order data</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-zinc-300 hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[40rem] min-h-[22rem] space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl px-3 py-2 text-sm ${msg.role === "user" ? "ml-8 bg-cyan-500/20 text-cyan-100" : "mr-8 bg-white/10 text-zinc-100"}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="mr-8 rounded-xl bg-white/10 px-3 py-2 text-sm text-zinc-300">Thinking...</div>}
          </div>

          <div className="border-t border-white/10 px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10 disabled:opacity-60"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about your order..."
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-3 text-cyan-100 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
