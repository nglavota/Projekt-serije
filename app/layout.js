import { Geist, Geist_Mono } from "next/font/google";
import LayoutHeader from "./components/LayoutHeader";
import LayoutFooter from "./components/LayoutFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Istraživanje TV serija │ JuniorDev",
  description: "Istražite najnovije TV serije uz Next.js aplikaciju.",
  keywords: ["Show", "Next.js", "React"],
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "Nikolina Glavota", url: "https://github.com/nglavota/Projekt-serije" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="hr">
      <body className="bg-gradient-to-b from-purple-900 via-purple-700 to-purple-500 text-white flex flex-col min-h-screen">
        <LayoutHeader />
        <main className="flex-grow px-6">{children}</main>
        <LayoutFooter />
      </body>
    </html>
  );
}
