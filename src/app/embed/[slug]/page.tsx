import ChatbotShell from "@/components/chatbot/ChatbotShell";
import { getChatbotConfigBySlugStrict } from "@/lib/chatbot-service";
import { notFound } from "next/navigation";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getChatbotConfigBySlugStrict(slug);

  if (!config) notFound();

  return (
    <div className="flex min-h-screen items-end justify-end bg-transparent p-5">
      <ChatbotShell config={config} embedded />
    </div>
  );
}
