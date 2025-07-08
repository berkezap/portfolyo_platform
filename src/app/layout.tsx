import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PortfolYO - GitHub İle 5 Dakikada Profesyonel Portfolyo",
  description: "GitHub projelerinizden 5 dakika içinde kod yazmadan profesyonel portfolyo sitesi oluşturun.",
  keywords: ["portfolyo", "github", "developer", "portfolio", "yazılımcı"],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
