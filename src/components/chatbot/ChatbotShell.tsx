"use client";

import { type ReactNode } from "react";
import type { ChatbotConfig } from "@/components/chatbot/types";
import { ChatbotProvider } from "./ChatbotProvider";
import Chatbot from "./Chatbot";

interface ChatbotShellProps {
  config: ChatbotConfig;
  children?: ReactNode;
  embedded?: boolean;
}

export default function ChatbotShell({
  config,
  children,
  embedded = false,
}: ChatbotShellProps) {
  return (
    <ChatbotProvider config={config}>
      {children}
      <Chatbot embedded={embedded} />
    </ChatbotProvider>
  );
}
