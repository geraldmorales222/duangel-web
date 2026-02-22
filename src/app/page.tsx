import React from 'react';
import InteractiveMap from "@/components/InteractiveMap";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-black min-h-screen">
      {/* --- SECCIÓN HERO --- */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        
        {/* IMAGEN DE FONDO CON MOVIMIENTO (Asegúrate de tener la imagen en public/images/hero-duangel.jpg) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110 animate-slow-zoom"
          style={{ backgroundImage: "url('/images/hero-duangel.webp')" }}
        >
          {/* Capa de tinte oscuro para legibilidad */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Efectos ambientales (Cenizas y Viñeta de época) */}
        <div className="absolute inset-0 embers z-[1] pointer-events-none"></div>
        <div className="absolute inset-0 vignette-overlay z-[2] pointer-events-none"></div>
        
        {/* Contenido Central */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
             <span className="font-cinzel text-amber-500/80 tracking-[0.6em] text-xs md:text-sm uppercase drop-shadow-lg">
                Una Historia de Roger Morales
             </span>
             <h1 className="text-7xl md:text-[11rem] font-medieval text-[#f2c005] drop-shadow-[0_10px_30px_rgba(0,0,0,1)] leading-none">
                Duangel
             </h1>
             <p className="font-cinzel text-xl md:text-3xl text-white tracking-[0.5em] uppercase drop-shadow-md">
                El Caídos de los Cielos
             </p>
          </div>
          
          <div className="pt-12">
            <Link href="/libros">
              <button className="btn-forged px-16 py-5 font-cinzel text-[#f2c005] text-lg tracking-[0.2em] hover:scale-105 transition-all duration-500 border-2 border-[#f2c005]/50 group">
                <span className="group-hover:text-white transition-colors">INICIAR SAGA</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Gradiente inferior para fundido con la piedra gris */}
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-[3]"></div>
      </section>

      {/* --- DIVISOR DE RUNAS --- */}
      <div className="rune-divider my-16"></div>

      {/* --- SECCIÓN MUNDO DE EMERIA (Estilo Piedra Gris Medieval) --- */}
      {/* --- SECCIÓN MUNDO DE EMERIA --- */}
      <section className="py-24 px-4 md:px-20 bg-black relative">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <h2 className="text-6xl md:text-8xl font-medieval text-[#f2c005] text-glow-gold">
              El Mapa de Emeria
            </h2>
            <div className="rune-divider w-64 mx-auto opacity-40"></div>
            <p className="font-cinzel text-gray-400 tracking-[0.3em] text-sm uppercase">
              Explora los dominios de la Saga Duangel
            </p>
          </div>

          {/* Llamada al componente interactivo */}
          <div className="relative z-10">
            <InteractiveMap />
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-10">
            <div className="bg-stone-medieval p-6 border border-white/5 rounded-lg text-center">
                <h3 className="font-medieval text-[#f2c005] text-2xl">Reinos Humanos</h3>
                <p className="text-gray-500 text-xs font-cinzel mt-2 tracking-widest">El Norte</p>
            </div>
            <div className="bg-stone-medieval p-6 border border-white/5 rounded-lg text-center">
                <h3 className="font-medieval text-[#f2c005] text-2xl">Tierras Prohibidas</h3>
                <p className="text-gray-500 text-xs font-cinzel mt-2 tracking-widest">El Sur</p>
            </div>
            <div className="bg-stone-medieval p-6 border border-white/5 rounded-lg text-center">
                <h3 className="font-medieval text-[#f2c005] text-2xl">Naturaleza Mística</h3>
                <p className="text-gray-500 text-xs font-cinzel mt-2 tracking-widest">Tierras Oscuras</p>
            </div>
          </div>
        </div>
      </section>
      {/* --- DIVISOR DE RUNAS --- */}
      <div className="rune-divider my-16"></div>

      {/* --- SECCIÓN DE LA OBRA Y AUTOR --- */}
      <section className="py-40 bg-black relative">
        <div className="max-w-5xl mx-auto text-center space-y-20">
            <div className="space-y-4">
              <h2 className="text-6xl font-medieval text-white">La Obra Maestra</h2>
              <div className="rune-divider w-48 mx-auto opacity-50"></div>
              <p className="font-cinzel text-amber-600 tracking-[0.4em] text-xs uppercase">Roger Morales</p>
            </div>
            
            <div className="bg-stone-medieval p-1 rounded-sm shadow-2xl hover:shadow-[#f2c005]/5 transition-all duration-700">
                <div className="border border-[#f2c005]/20 p-10 md:p-16 flex flex-col md:flex-row gap-16 items-center">
                    {/* Portada del Libro */}
                    <div className="w-64 h-[24rem] bg-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/5 flex-shrink-0 transition-all hover:scale-105 duration-500 relative group">
                        <div className="absolute inset-0 border border-[#f2c005]/0 group-hover:border-[#f2c005]/20 transition-all"></div>
                        <img src="images/portada-duangel.webp" alt="Portada Duangel" className="w-full h-full object-cover" /> 
                    </div>
                    
                    <div className="text-left space-y-8 flex-1">
                        <h3 className="text-4xl font-cinzel text-[#f2c005] tracking-tight">Duangel: el Caído de los Cielos</h3>
                        <p className="text-gray-400 text-xl leading-relaxed font-light italic">
                          "Tras una larga y devastadora guerra entre humanos y criaturas de la oscuridad, el continente de Emeria lucha por reconstruirse. Es en ese mundo herido, un grupo de jóvenes deberá forjar su propio destino y dar forma a sus sueños, mientras la amenaza latente de la oscuridad aguarda, paciente y silenciosa desde las sombras.”<br />

                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            La primera entrega de una saga épica donde el pasado condena, el poder corrompe y la oscuridad observa. Una historia que comienza entre las cenizas de un pasado que aún no ha terminado de arder.
                        </p>
                        <div className="pt-4">
                          <a 
                            href="https://www.amazon.ca/DUANGEL-EL-CAIDO-LOS-CIELOS/dp/9564236525" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <button className="btn-forged px-10 py-4 font-cinzel text-xs text-[#f2c005] tracking-widest uppercase">
                              Adquirir en Amazon
                            </button>
                          </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
      {/* --- DIVISOR DE RUNAS --- */}
      <div className="rune-divider my-16"></div>

      {/* --- SECCIÓN DEL AUTOR: ROGER MORALES --- */}
      <section className="py-32 relative overflow-hidden bg-[#050505]">
        {/* Decoración de fondo mística */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#f2c005]/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="bg-stone-medieval border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-12 gap-0">
              
              {/* Columna de Imagen: Estilo Retrato Antiguo */}
              <div className="md:col-span-5 relative h-[400px] md:h-auto overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent  z-10 hidden md:block w-20 right-0"></div>
                <img 
                  src="/images/roger-morales.webp" 
                  alt="Roger Morales - Autor de Duangel" 
                  className="w-full h-full object-cover  hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              {/* Columna de Texto: La Pluma detrás de la Saga */}
              <div className="md:col-span-7 p-10 md:p-16 flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <h3 className="font-cinzel text-[#f2c005] text-xs tracking-[0.5em] uppercase">El Arquitecto de Emeria</h3>
                  <h2 className="text-5xl font-cinzel text-white">Roger Morales</h2>
                </div>
                
                <div className="w-20 h-px bg-[#f2c005]/40"></div>

                <p className="text-gray-300 text-lg leading-relaxed font-light italic">
                  "Escribir Duangel no fue solo crear una historia, fue abrir un portal a un reino que reclamaba ser contado. Cada palabra en Caídos del Cielo es una runa tallada en la memoria de este mundo."
                </p>

                <p className="text-gray-400 text-sm leading-relaxed">
                  Escritor y creador de mundos, Roger Morales ha dedicado años a la construcción del universo de Duangel. Su visión entrelaza la fantasía épica clásica con dilemas morales contemporáneos, invitando al lector no solo a leer la historia, sino a habitar el continente de Emeria 
                </p>

                <div className="pt-6 flex gap-8">
                  <div className="text-center">
                    <p className="font-medieval text-[#f2c005] text-3xl">1</p>
                    <p className="font-cinzel text-[9px] text-gray-500 tracking-widest uppercase">Saga Principal</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medieval text-[#f2c005] text-3xl">+</p>
                    <p className="font-cinzel text-[9px] text-gray-500 tracking-widest uppercase">Relatos de Lore</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medieval text-[#f2c005] text-3xl">2026</p>
                    <p className="font-cinzel text-[9px] text-gray-500 tracking-widest uppercase">Expansión Cómics</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


    </div>
  );
}