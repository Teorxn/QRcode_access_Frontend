import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Control Acceso Dashboard",
  description: "Dashboard para control de acceso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <div className="flex h-screen w-full font-sans overflow-hidden">
          <Sidebar />
          <main className="flex-grow bg-[#f4f7fe] p-8 overflow-y-auto flex flex-col gap-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
