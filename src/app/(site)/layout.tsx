import Navbar from "@/shared/Navbar";
import Footer from "@/shared/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-[#070d1f] text-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
