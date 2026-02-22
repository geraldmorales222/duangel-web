'use client';

import { useState } from 'react';

export default function LibrosPage() {
  const [selectedLibro, setSelectedLibro] = useState<any | null>(null);

  const libros = [
    {
      id: 1,
      titulo: "Duangel el Caído de los Cielos",
      subtitulo: "Cenizas",
      saga: "Duangel Vol. 1",
      descripcion: "Tras el fin de una guerra devastadora, Emeria intenta reconstruirse mientras los reinos buscan un nuevo equilibrio, En medio de un continente marcado por las cicatrices del pasado, un grupo de jóvenes lucha por abrirse camino, sin saber que sus decisiones moldearán el destino de una historia que aún se escribe entre las cenizas",
      imagen: "/images/portada-duangel.webp",
      amazonLink: "https://www.amazon.ca/DUANGEL-EL-CAIDO-LOS-CIELOS/dp/9564236525"
    },
    {
      id: 2,
      titulo: "Duangel el Caído de los Cielos",
      subtitulo: "Sombra",
      saga: "Duangel Vol. 2",
      descripcion: "Antiguas señales anuncian que la oscuridad nunca fue vencida. Los conflicto entre los reinos se intensifican y la frágil paz comienza a resquebrajarse, En este escenario, un grupo de jóvenes deberá enfrentan a nuevos desafíos que pondrán a prueba no solo su lealtad y su valor, sino también que el destino mismo de Emeria.",
      imagen: "/images/Portada.Sombras.mesa.webp",
      amazonLink: "#" // BLOQUEADO
    },
    {
      id: 3,
      titulo: "Duangel el Caído de los Cielos",
      subtitulo: "Fuego",
      saga: "Duangel Vol. 3",
      descripcion: "El fuego del pasado despertara una vez más, con una fuerza renovadora. Cuando arda, una última batalla definirá el futuro de Emeria.",
      imagen: "/images/Portada.mesa.fuego.webp",
      amazonLink: "#" // BLOQUEADO
    },
    {
      id: 4,
      titulo: "Duangel el Caído de los Cielos",
      subtitulo: "Sangre",
      saga: "Duangel Vol. 4",
      descripcion: "El linaje de los caídos reclamará su trono. El capítulo más oscuro de la saga, donde el destino se sella con sangre, sacrificio y pérdidas que marcarán para siempre el destino de Emeria.",
      imagen: "/images/Portada.mesa.sangre.webp",
      amazonLink: "#" // BLOQUEADO
    }
  ];

  return (
    <div className="min-h-screen p-6 md:p-24 bg-black relative">
      <h1 className="text-5xl font-cinzel text-[#f2c005] text-center mb-16 tracking-widest pt-16 md:pt-0 ">
        Libros de la Saga
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {libros.map((libro) => (
          <div key={libro.id} className="bg-zinc-900/40 p-6 rounded-2xl border border-white/10 hover:border-[#f2c005]/40 transition-all group shadow-2xl">
            <div className="aspect-[2/3] bg-zinc-800 mb-6 overflow-hidden rounded-xl border border-white/5 shadow-inner">
              <img src={libro.imagen} alt={libro.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
            </div>
            <div className="space-y-1 mb-6">
              <h3 className="font-cinzel text-[#f2c005] text-2xl leading-none">{libro.titulo}</h3>
              <h4 className="font-cinzel text-gray-300 text-xl italic">{libro.subtitulo}</h4>
              <p className="font-cinzel text-[10px] text-gray-500 tracking-widest uppercase">{libro.saga}</p>
            </div>
            
            <button 
              onClick={() => setSelectedLibro(libro)}
              className="w-full py-3 font-cinzel text-[10px] tracking-[0.2em] text-[#f2c005] border border-[#f2c005]/30 rounded-xl hover:bg-[#f2c005] hover:text-black transition-all duration-300 font-bold uppercase"
            >
              Detalles del Tomo
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE DETALLES */}
      {selectedLibro && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-10 bg-black/98 backdrop-blur-md overflow-hidden">
          <div className="bg-zinc-900 w-full h-full md:h-auto md:max-w-5xl md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_80px_rgba(242,192,5,0.15)] border border-white/5">
            
            {/* BOTÓN CERRAR */}
            <button 
              onClick={() => setSelectedLibro(null)} 
              className="absolute top-6 right-6 z-[210] bg-black/60 text-[#f2c005] w-12 h-12 rounded-full flex items-center justify-center border border-[#f2c005]/30 hover:bg-[#f2c005] hover:text-black transition-all shadow-lg"
            >
              ✕
            </button>

            {/* PORTADA */}
            <div className="relative w-full md:w-[400px] h-[40vh] md:h-auto flex-shrink-0 bg-stone-800 border-b md:border-b-0 md:border-r border-white/10">
              <img src={selectedLibro.imagen} className="w-full h-full object-cover" alt={selectedLibro.subtitulo} />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent md:hidden" />
            </div>

            {/* INFORMACIÓN */}
            <div className="flex-1 overflow-y-auto p-8 md:p-16 space-y-8 h-[60vh] md:h-auto
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-[#f2c005]/20
                [&::-webkit-scrollbar-thumb]:rounded-full">
              
              <div className="space-y-2 pr-10 md:pr-0">
                <span className="text-[#f2c005] font-cinzel text-[10px] tracking-[0.4em] uppercase opacity-60">{selectedLibro.saga}</span>
                <h2 className="text-4xl md:text-6xl font-medieval text-white leading-tight">{selectedLibro.titulo}</h2>
                <h3 className="text-2xl md:text-3xl font-cinzel text-[#f2c005] italic opacity-80">{selectedLibro.subtitulo}</h3>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/10 pb-2">Sinopsis del Tomo</label>
                <p className="text-gray-200 text-lg leading-relaxed italic font-light whitespace-pre-wrap font-serif border-l-2 border-[#f2c005]/20 pl-6">
                  {selectedLibro.descripcion}
                </p>
              </div>

              <div className="pt-10 flex flex-col gap-6">
                <a 
                  href={selectedLibro.amazonLink === "#" ? "#" : selectedLibro.amazonLink} 
                  target={selectedLibro.amazonLink === "#" ? "_self" : "_blank"} 
                  rel="noopener noreferrer"
                  className="w-full"
                  onClick={(e) => selectedLibro.amazonLink === "#" && e.preventDefault()}
                >
                  <button 
                    disabled={selectedLibro.amazonLink === "#"}
                    className={`w-full py-5 font-cinzel font-black text-xs tracking-[0.2em] uppercase rounded-2xl transition-all shadow-xl active:scale-[0.98]
                      ${selectedLibro.amazonLink === "#" 
                        ? "bg-zinc-800 text-gray-600 border border-white/5 cursor-not-allowed opacity-40 shadow-none" 
                        : "bg-[#f2c005] text-black hover:bg-white shadow-[#f2c005]/10"
                      }`}
                  >
                    {selectedLibro.amazonLink === "#" 
                      ? "En Proceso de Produccion" 
                      : "Adquirir en Amazon"}
                  </button>
                </a>
                
                <p className="text-[10px] text-center text-gray-600 font-cinzel tracking-[0.3em] uppercase italic">
                  {selectedLibro.amazonLink === "#" 
                    ? "Próximamente en los Anales de Emeria" 
                    : "Disponible en formato físico y digital"}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}