import HeroSection from "@/sections/HeroSection";
import { ChatbotShell } from "@/components/chatbot";
import { fetchChatbotConfig } from "@/lib/chatbot";

const SITE_SLUG = "elite-plumbing-pro";

export default async function Home() {
  const chatbotConfig = await fetchChatbotConfig(SITE_SLUG);

  if (!chatbotConfig) {
    return (
      <main className="flex-1">
        <HeroSection />
      </main>
    );
  }

  return (
    <ChatbotShell config={chatbotConfig}>
      <main className="flex-1">
        <HeroSection />
      </main>
    </ChatbotShell>
  );
}
