import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/content";
import { FirebaseProvider } from "@/firebase/provider";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: "Your journey to lifelong companionship starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased bg-background")}>
        <FirebaseProvider>
            {children}
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}