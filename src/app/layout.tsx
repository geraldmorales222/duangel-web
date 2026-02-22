// src/app/layout.tsx
import "../app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Duangel: Caídos del Cielo | Saga Oficial",
  description: "Explora los anales de Emeria en la obra épica de Roger Morales.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-black text-white antialiased flex flex-col min-h-screen">
        <Navbar />
        
        {/* pt-20 es la clave: empuja el contenido hacia abajo el mismo alto que tiene el Navbar (h-20) */}
        <main className="flex-grow pt-20">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}