import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { Inter } from "next/font/google";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next-U Ambassador",
  description: "L'application pour les ambassadeurs next-u",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(inter.className, "bg-background h-full")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
