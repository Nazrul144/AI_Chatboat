export interface ChatbotTheme {
  primary: string;
  primaryHover: string;
  header: string;
  headerText: string;
  headerSubtext: string;
  text: string;
  onPrimary: string;
  assistantBubble: string;
  avatarBg: string;
}

export interface ChatbotConfig {
  slug: string;
  assistantName: string;
  companyName: string;
  welcomeMessage: string;
  quickQuestions: string[];
  borderRadius: number;
  theme: ChatbotTheme;
  isActive?: boolean;
}
