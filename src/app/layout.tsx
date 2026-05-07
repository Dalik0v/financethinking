import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fintech Tracker",
  description: "Minimalist banking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="h-full antialiased" data-theme="dark">

      <head>


      </head>
<body suppressHydrationWarning className={`${inter.className} min-h-full flex flex-col bg-background text-foreground`}>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
