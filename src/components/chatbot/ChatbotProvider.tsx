"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ChatbotConfig } from "./types";

interface ChatbotContextValue {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  config: ChatbotConfig;
}

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

interface ChatbotProviderProps {
  children: ReactNode;
  config: ChatbotConfig;
}

export function ChatbotProvider({ children, config }: ChatbotProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = useCallback(() => setIsOpen(true), []);
  const closeChatbot = useCallback(() => setIsOpen(false), []);
  const toggleChatbot = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({
      isOpen,
      openChatbot,
      closeChatbot,
      toggleChatbot,
      config,
    }),
    [isOpen, openChatbot, closeChatbot, toggleChatbot, config],
  );

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}
