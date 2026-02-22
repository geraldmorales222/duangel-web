'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function RogerPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-40 relative">
      <div className="max-w-6xl mx-auto pt-20 md:pt-0"> {/* pt-20 evita que el Navbar tape el título */}
        
        {/* SECCIÓN PRINCIPAL: BIO Y FOTO */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start mb-16 md:mb-20">
          
          {/* FOTO DE AUTOR (Responsiva) */}
          <div className="w-full max-w-[400px] md:w-[450px] aspect-[2/3] relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
            <img 
              src="/images/roger-morales.webp" 
              alt="Roger Morales - Autor de Duangel"
              className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Gradiente sutil sobre la foto para integrar con el fondo negro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>

          {/* TEXTO BIOGRÁFICO */}
          <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
            <div className="space-y-2">
              <span className="text-[#f2c005] font-cinzel text-[10px] md:text-sm tracking-[0.4em] uppercase block">
                El Arquitecto de Emeria
              </span>
              <h1 className="text-5xl md:text-7xl font-medieval text-white leading-tight">
                Roger Morales
              </h1>
            </div>

            <div className="bg-white/5 p-6 md:p-10 rounded-[2rem] border border-white/5 space-y-6 backdrop-blur-sm">
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed italic border-l-2 border-[#f2c005]/30 pl-4 md:pl-6 text-left">
                "Las historias no se escriben, se rescatan del silencio de los mundos que aún no hemos visitado."
              </p>
              
              <div className="space-y-6 text-gray-400 font-cinzel leading-loose text-sm text-left">
                <p>
                  Roger Morales es el visionario detrás de la saga <strong className="text-white">Duangel: EL Caído de los Cielos</strong>. Con una pluma forjada en la épica y el misticismo, ha dedicado años a cartografiar los reinos de Emeria y a dar voz a sus personajes más profundos.
                </p>
                <p>
                  Su obra se caracteriza por una exploración única de la dualidad humana, la redención y los misterios que yacen más allá del firmamento. A través de sus crónicas, Roger invita a los lectores a cuestionar la realidad y a sumergirse en una odisea donde la sangre y la ceniza cuentan la verdadera historia de los caídos.
                </p>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/libros" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-[#f2c005] text-black font-cinzel font-black text-[10px] tracking-widest uppercase rounded-xl hover:bg-white transition-all shadow-lg shadow-[#f2c005]/10">
                  Explorar su Obra
                </button>
              </Link>
              <Link href="/mundo-emeria" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 border border-white/20 text-white font-cinzel font-black text-[10px] tracking-widest uppercase rounded-xl hover:bg-white hover:text-black transition-all">
                  Ver Cartografía
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: FILOSOFÍA DE ESCRITURA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-16 pb-12">
          <div className="space-y-3 text-center">
            <h3 className="text-[#f2c005] font-medieval text-2xl">Inspiración</h3>
            <p className="text-gray-500 text-[10px] font-cinzel uppercase tracking-[0.2em] leading-relaxed">La mitología clásica y los cielos infinitos.</p>
          </div>
          <div className="space-y-3 text-center">
            <h3 className="text-[#f2c005] font-medieval text-2xl">Propósito</h3>
            <p className="text-gray-500 text-[10px] font-cinzel uppercase tracking-[0.2em] leading-relaxed">Crear una saga épica medieval para el mundo.</p>
          </div>
          <div className="space-y-3 text-center">
            <h3 className="text-[#f2c005] font-medieval text-2xl">Legado</h3>
            <p className="text-gray-500 text-[10px] font-cinzel uppercase tracking-[0.2em] leading-relaxed">Heredar al mundo un nuevo universo de fantasía.</p>
          </div>
        </div>

      </div>
    </div>
  );
}