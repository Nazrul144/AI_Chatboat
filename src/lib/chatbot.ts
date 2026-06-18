import type { ChatbotConfig, ChatbotTheme } from "@/components/chatbot/types";

// ─── Types (backend API shapes) ───────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
}

interface BackendAssistantConfig {
  slug: string;
  business_name: string;
  is_active: boolean;
  ui_theme_color: string;
  ui_text_color?: string;
  ui_border_radius: string;
}

const SESSION_KEY_PREFIX = "nexflow_session_id_";

// ─── Config ─────────────────────────────────────────────────────────────────

export function getApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_CHATBOT_API_URL ??
    "http://13.61.225.84:8000/api/v1/assistants/public"
  ).replace(/\/+$/, "");
}

function parseBorderRadius(value: string): number {
  const match = String(value).trim().match(/^(\d+)/);
  return match ? Number(match[1]) : 12;
}

function buildTheme(primaryColor: string, textColor?: string): ChatbotTheme {
  const normalize = (hex: string) => {
    const v = hex.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    if (/^#[0-9a-fA-F]{3}$/.test(v)) {
      return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
    }
    return "#4f46e5";
  };

  const adjust = (hex: string, amount: number) => {
    const primary = normalize(hex);
    const r = parseInt(primary.slice(1, 3), 16);
    const g = parseInt(primary.slice(3, 5), 16);
    const b = parseInt(primary.slice(5, 7), 16);
    const factor = 1 + amount;
    const toHex = (n: number) =>
      Math.max(0, Math.min(255, Math.round(n)))
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r * factor)}${toHex(g * factor)}${toHex(b * factor)}`;
  };

  const primary = normalize(primaryColor);
  const text = textColor ? normalize(textColor) : "#1f2937";

  return {
    primary,
    primaryHover: adjust(primary, -0.12),
    header: adjust(primary, -0.35),
    headerText: textColor ? text : "#ffffff",
    headerSubtext: textColor ? text : adjust(primary, 0.45),
    text,
    avatarBg: adjust(primary, 0.15),
  };
}

function mapToChatbotConfig(api: BackendAssistantConfig): ChatbotConfig {
  return {
    slug: api.slug,
    companyName: api.business_name,
    assistantName: `${api.business_name} Assistant`,
    welcomeMessage: `Hi there! I am the assistant from ${api.business_name}. Ask me about services, pricing, or emergency help.`,
    quickQuestions: ["Roof leak", "Emergency", "Pricing", "Book visit"],
    borderRadius: parseBorderRadius(api.ui_border_radius),
    theme: buildTheme(api.ui_theme_color, api.ui_text_color),
    isActive: api.is_active,
  };
}

/** Server-side: fetch UI config from Django (GET /{slug}/) */
export async function fetchChatbotConfig(
  slug: string,
): Promise<ChatbotConfig | null> {
  try {
    const response = await fetch(`${getApiBase()}/${slug}/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as BackendAssistantConfig;
    if (!data.is_active) return null;

    return mapToChatbotConfig(data);
  } catch {
    return null;
  }
}

// ─── Session ─────────────────────────────────────────────────────────────────

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateSessionId(slug: string): string {
  const key = `${SESSION_KEY_PREFIX}${slug}`;
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const created = generateUUID();
    localStorage.setItem(key, created);
    return created;
  } catch {
    return generateUUID();
  }
}

// ─── Client API helpers (browser uses same-origin proxy) ─────────────────────

function chatUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `/api/proxy/chatbot/${slug}/chat`;
  }
  return `${getApiBase()}/${slug}/chat/`;
}

function historyUrl(slug: string, sessionId: string): string {
  if (typeof window !== "undefined") {
    return `/api/proxy/chatbot/${slug}/history?session_id=${encodeURIComponent(sessionId)}`;
  }
  return `${getApiBase()}/${slug}/history/?session_id=${encodeURIComponent(sessionId)}`;
}

/** GET /{slug}/history/?session_id= — load previous messages */
export async function fetchChatHistory(
  slug: string,
  sessionId: string,
): Promise<ChatMessage[]> {
  const response = await fetch(historyUrl(slug, sessionId), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`History request failed (${response.status})`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data.filter(
    (item): item is ChatMessage =>
      item != null &&
      typeof item.content === "string" &&
      (item.role === "user" || item.role === "assistant"),
  );
}

/** POST /{slug}/chat/ — send message and get AI reply */
export async function sendChatMessage(
  slug: string,
  sessionId: string,
  message: string,
): Promise<ChatResponse> {
  const response = await fetch(chatUrl(slug), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  const data = (await response.json().catch(() => null)) as
    | (ChatResponse & { error?: string })
    | null;

  if (!response.ok || !data?.response) {
    console.warn("[NexFlow Chat]", response.status, data);
    throw new Error(data?.error ?? `Chat request failed (${response.status})`);
  }

  return data;
}
