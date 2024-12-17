import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/Theme/theme-provider"
import "./globals.css";
import { ModeToggle } from "../components/Theme/toggleTheme";
import Navbar from "@/components/Navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MSU LMS",
  description: "Learning Management System for MSU Baroda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <ModeToggle /> */}
          <Navbar />
          {children}
        </ThemeProvider></body>
    </html>
  );
}
