import ChatbotShell from "@/components/chatbot/ChatbotShell";
import { fetchChatbotConfig } from "@/lib/chatbot";
import { notFound } from "next/navigation";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await fetchChatbotConfig(slug);

  if (!config) notFound();

  return (
    <div className="flex min-h-screen items-end justify-end bg-transparent p-5">
      <ChatbotShell config={config} embedded />
    </div>
  );
}
