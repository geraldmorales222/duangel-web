// src/app/layout.tsx
import "../app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next"; // Importante para el tipado

export const metadata: Metadata = {
  title: "Duangel: Caídos del Cielo | Saga Oficial",
  description: "Explora los anales de Emeria en la obra épica de Roger Morales.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-black text-white antialiased flex flex-col min-h-screen">
        <Navbar />
        
        {/* Contenido principal con padding para el Navbar */}
        <main className="flex-grow pt-20">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}