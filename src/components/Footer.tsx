'use client';

import Link from 'next/link';
import { FaInstagram, FaTiktok, FaYoutube, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-950 border-t border-white/5 pt-20 pb-12 mt-auto relative overflow-hidden">
      {/* Línea decorativa superior que recorre todo el ancho */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f2c005]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* USAMOS FLEX Y JUSTIFY-BETWEEN PARA OCUPAR TODO EL ANCHO */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
          
          {/* Columna 1: Branding y Redes (Ancho max-sm para que no se pegue al resto) */}
          <div className="space-y-6 max-w-sm">
            <div>
              <h3 className="font-medieval text-[#f2c005] text-4xl tracking-tighter mb-4">Duangel</h3>
              <p className="font-cinzel text-gray-400 text-[11px] leading-relaxed uppercase tracking-[0.2em]">
                El Caídos de los Cielos. <br />
                Una obra original de Roger Morales.
              </p>
            </div>
            <div className="flex gap-6 text-gray-500">
              <a href="https://instagram.com/duangel_el_caido_de_los_cielos" target="_blank" className="hover:text-[#f2c005] transition-colors active:scale-90"><FaInstagram size={18} /></a>
              <a href="https://tiktok.com/@duangel.el.caido.del.c" target="_blank" className="hover:text-[#f2c005] transition-colors active:scale-90"><FaTiktok size={18} /></a>
              <a href="https://youtube.com/@Duangelelcaídodeloscielos" target="_blank" className="hover:text-[#f2c005] transition-colors active:scale-90"><FaYoutube size={18} /></a>
            </div>
          </div>

          {/* Columna 2: Navegación Sagrada */}
          <div className="flex flex-col gap-5">
            <h4 className="font-cinzel text-white text-[12px] uppercase tracking-[0.3em] font-bold border-b border-[#f2c005]/20 pb-2 w-fit">Navegación</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/mundo-emeria" className="text-gray-500 hover:text-[#f2c005] text-[10px] uppercase tracking-widest transition-all hover:translate-x-1">Mundo Emeria</Link>
              <Link href="/historias" className="text-gray-500 hover:text-[#f2c005] text-[10px] uppercase tracking-widest transition-all hover:translate-x-1">Historias Cortas</Link>
              <Link href="/arte-conceptual" className="text-gray-500 hover:text-[#f2c005] text-[10px] uppercase tracking-widest transition-all hover:translate-x-1">Galería de Arte</Link>
              <Link href="/blog" className="text-gray-500 hover:text-[#f2c005] text-[10px] uppercase tracking-widest transition-all hover:translate-x-1">Noticias del Blog</Link>
            </nav>
          </div>

          {/* Columna 3: Información de Contacto (Alineada a la derecha en PC) */}
          <div className="flex flex-col gap-5 md:items-end">
            <h4 className="font-cinzel text-white text-[12px] uppercase tracking-[0.3em] font-bold border-b border-[#f2c005]/20 pb-2 w-fit">Canales Oficiales</h4>
            <div className="space-y-4 md:text-right">
              <div className="flex items-center md:justify-end gap-3 text-gray-500 group cursor-pointer">
                <p className="text-[11px] uppercase tracking-widest font-medium group-hover:text-[#f2c005] transition-colors">duangelelcaidodeloscielos@gmail.com</p>
                <FaEnvelope className="text-[#f2c005]/50 group-hover:text-[#f2c005]" />
              </div>
              <p className="text-gray-500 text-[11px] uppercase tracking-widest">Viña del Mar, Chile</p>
              <p className="text-[#f2c005]/40 font-medieval italic text-xl tracking-tighter">Saga Duangel</p>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN INFERIOR: CRÉDITOS --- */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="font-cinzel text-gray-700 text-[9px] uppercase tracking-[0.4em] mb-1">
              © {currentYear} SAGA DUANGEL - TODOS LOS DERECHOS RESERVADOS
            </p>
          </div>

          {/* Bloque de Marca: YonkoServicios */}
          <div className="flex flex-col items-center md:items-end gap-1 group">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-white text-[9px] uppercase tracking-[0.4em]">Desarrollado por</span>
              <a 
              href="https://yonkoservicios.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-cinzel text-white hover:text-[#f2c005] text-[9px] uppercase tracking-[0.5em] transition-all border-b border-transparent hover:border-[#f2c005] pb-0.5"
            >
              yonkoservicios
            </a>
            </div>
            <a 
              href="https://yonkoservicios.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-cinzel text-white hover:text-[#f2c005] text-[9px] uppercase tracking-[0.5em] transition-all border-b border-transparent hover:border-[#f2c005] pb-0.5"
            >
              www.yonkoservicios.com
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}