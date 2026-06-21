"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { useChatbot } from "./ChatbotProvider";
import {
  fetchChatHistory,
  getOrCreateSessionId,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/chatbot";

function AssistantAvatar({ bg }: { bg: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 11L12 4L21 11V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V11Z"
          fill="#f5c542"
          stroke="#fff"
          strokeWidth="1"
        />
        <path d="M9 21V13H15V21" fill="#e8e0d0" stroke="#fff" strokeWidth="0.75" />
      </svg>
    </div>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5C21 16.75 16.75 21 11.5 21C10.1 21 8.75 20.7 7.55 20.15L3 21L3.85 16.45C3.3 15.25 3 13.9 3 12.5C3 7.25 7.25 3 12.5 3C17.75 3 21 7.25 21 11.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div
      className="max-w-[90%] bg-gray-100 px-3.5 py-2.5 text-sm text-gray-500"
      style={{ borderRadius: "var(--chatbot-radius-sm)", borderTopLeftRadius: "4px" }}
      aria-label="Assistant is typing"
    >
      <span className="inline-flex gap-1">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce [animation-delay:150ms]">.</span>
        <span className="animate-bounce [animation-delay:300ms]">.</span>
      </span>
    </div>
  );
}

export default function Chatbot({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { isOpen, closeChatbot, toggleChatbot, config } = useChatbot();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState(() =>
    typeof window !== "undefined" ? getOrCreateSessionId(config.slug) : "",
  );
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const radius = config.borderRadius ?? 12;

  const themeVars = {
    "--chatbot-primary": config.theme.primary,
    "--chatbot-primary-hover": config.theme.primaryHover,
    "--chatbot-header": config.theme.header,
    "--chatbot-header-text": config.theme.headerText,
    "--chatbot-header-subtext": config.theme.headerSubtext,
    "--chatbot-assistant-bg": config.theme.assistantBubble,
    "--chatbot-on-primary": config.theme.onPrimary,
    "--chatbot-text": config.theme.text,
    "--chatbot-radius": `${radius}px`,
    "--chatbot-radius-sm": `${Math.max(0, radius - 4)}px`,
    "--chatbot-radius-pill": radius === 0 ? "0px" : "9999px",
  } as CSSProperties;

  useEffect(() => {
    if (!sessionId) {
      setSessionId(getOrCreateSessionId(config.slug));
    }
  }, [config.slug, sessionId]);

  useEffect(() => {
    if (!isOpen || historyLoaded || historyLoading || !sessionId) return;

    setHistoryLoading(true);
    fetchChatHistory(config.slug, sessionId)
      .then((items) => {
        setMessages(items);
        setHistoryLoaded(true);
      })
      .catch(() => {
        setHistoryLoaded(true);
      })
      .finally(() => {
        setHistoryLoading(false);
      });
  }, [isOpen, historyLoaded, historyLoading, config.slug, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, error]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending || !sessionId) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsSending(true);
    setIsTyping(true);

    try {
      const data = await sendChatMessage(config.slug, sessionId, trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const containerClass = embedded
    ? "relative flex flex-col items-end gap-3"
    : "fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3";

  const windowWidthClass = embedded
    ? "w-full max-w-[380px]"
    : "w-[min(100vw-2.5rem,420px)]";

  const inputDisabled = isSending || historyLoading;

  return (
    <div className={containerClass} style={themeVars}>
      {isOpen && (
        <div
          className={`flex ${windowWidthClass} flex-col overflow-hidden border border-gray-200 bg-white shadow-2xl`}
          style={{ borderRadius: "var(--chatbot-radius)" }}
          role="dialog"
          aria-label={`${config.assistantName} chat`}
        >
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              backgroundColor: "var(--chatbot-header)",
              borderTopLeftRadius: "var(--chatbot-radius)",
              borderTopRightRadius: "var(--chatbot-radius)",
            }}
          >
            <AssistantAvatar bg={config.theme.avatarBg} />
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-bold"
                style={{ color: "var(--chatbot-header-text)" }}
              >
                {config.assistantName}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--chatbot-header-subtext)", opacity: 0.7 }}
              >
                Online · Typically replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={closeChatbot}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              style={{ color: "var(--chatbot-header-text)", opacity: 0.85 }}
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex max-h-96 flex-col gap-3 overflow-y-auto px-4 py-4">
            <div
              className="max-w-[90%] px-3.5 py-2.5 text-sm leading-relaxed"
              style={{
                backgroundColor: "var(--chatbot-assistant-bg)",
                color: "var(--chatbot-text)",
                borderRadius: "var(--chatbot-radius-sm)",
                borderTopLeftRadius: "4px",
              }}
            >
              {config.welcomeMessage}
            </div>

            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}-${msg.content.slice(0, 20)}`}
                className={`max-w-[85%] px-3.5 py-2.5 text-sm ${
                  msg.role === "user" ? "ml-auto" : ""
                }`}
                style={{
                  color:
                    msg.role === "user"
                      ? "var(--chatbot-on-primary)"
                      : "var(--chatbot-text)",
                  backgroundColor:
                    msg.role === "user"
                      ? "var(--chatbot-primary)"
                      : "var(--chatbot-assistant-bg)",
                  borderRadius: "var(--chatbot-radius-sm)",
                  borderTopRightRadius: msg.role === "user" ? "4px" : undefined,
                  borderTopLeftRadius:
                    msg.role === "assistant" ? "4px" : undefined,
                }}
              >
                {msg.content}
              </div>
            ))}

            {isTyping && <TypingIndicator />}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                {error}
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {config.quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => handleSend(question)}
                disabled={inputDisabled}
                className="border border-gray-200 bg-white px-3 py-1 text-xs font-medium transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  color: "var(--chatbot-text)",
                  borderRadius: "var(--chatbot-radius-pill)",
                }}
              >
                {question}
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-gray-100 px-3 py-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={inputDisabled}
              className="min-w-0 flex-1 border border-gray-200 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-[var(--chatbot-primary)] focus:outline-none disabled:bg-gray-50"
              style={{
                color: "var(--chatbot-text)",
                borderRadius: "var(--chatbot-radius-pill)",
              }}
            />
            <button
              type="submit"
              disabled={inputDisabled}
              className="flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: "var(--chatbot-primary)",
                color: "var(--chatbot-on-primary)",
                borderRadius: radius === 0 ? "0" : "9999px",
              }}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      <div className="group relative">
        <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-[#1a2b4b] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Active Now
        </span>

        <button
          type="button"
          onClick={toggleChatbot}
          className="relative flex h-16 w-16 items-center justify-center text-white shadow-lg transition-transform hover:scale-105 hover:opacity-90"
          style={{
            backgroundColor: "var(--chatbot-primary)",
            color: "var(--chatbot-on-primary)",
            borderRadius: radius === 0 ? "0" : "9999px",
          }}
          aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
          aria-expanded={isOpen}
        >
          <span
            className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
            aria-hidden="true"
          />
          <ChatBubbleIcon />
        </button>
      </div>
    </div>
  );
}
