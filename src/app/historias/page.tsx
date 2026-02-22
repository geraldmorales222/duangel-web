'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function HistoriasPage() {
  const [historias, setHistorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHistoria, setSelectedHistoria] = useState<any | null>(null);

  useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "historias"));
        setHistorias(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchHistorias();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-24 bg-black text-white relative">
      <h1 className="text-4xl md:text-5xl font-cinzel text-[#f2c005] text-center mb-12 md:mb-16 tracking-tighter pt-20 md:pt-0">
        Relatos de Origen
      </h1>
      
      {/* LISTADO DE PERGAMINOS */}
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {loading ? (
          <p className="text-center font-cinzel animate-pulse text-gray-500 uppercase tracking-widest">Consultando crónicas...</p>
        ) : historias.map((historia) => (
          <div 
            key={historia.id}
            onClick={() => setSelectedHistoria(historia)}
            className="bg-zinc-900/30 p-5 md:p-8 border-l-4 border-[#f2c005]/20 hover:border-[#f2c005] hover:bg-zinc-800/40 transition-all cursor-pointer group rounded-r-2xl border border-white/5 overflow-hidden"
          >
            <div className="flex flex-row gap-4 md:gap-8 items-start">
              {historia.imagenUrl && (
                <div className="w-20 md:w-32 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-xl">
                  <img src={historia.imagenUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={historia.nombre} />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
                <h2 className="font-cinzel text-xl md:text-3xl text-white group-hover:text-[#f2c005] transition-colors truncate">{historia.nombre}</h2>
                <p className="font-cinzel text-[8px] md:text-[10px] text-amber-600 tracking-widest uppercase">{historia.genero}</p>
                <p className="text-gray-400 font-light italic text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                  "{historia.texto}"
                </p>
                <span className="text-[#f2c005] text-[9px] font-cinzel uppercase tracking-[0.2em] border-b border-transparent group-hover:border-[#f2c005] transition-all">Abrir Pergamino</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VISOR INMERSIVO MEJORADO (IMAGEN COMPLETA) */}
      {selectedHistoria && (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col md:flex-row animate-in fade-in duration-300 overflow-y-auto md:overflow-hidden">
          
          {/* BOTÓN CERRAR - ACCESO RÁPIDO */}
          <button 
            onClick={() => setSelectedHistoria(null)} 
            className="fixed top-6 right-6 z-[400] bg-black/80 text-[#f2c005] w-12 h-12 rounded-full flex items-center justify-center border border-[#f2c005]/40 backdrop-blur-md shadow-2xl active:scale-90"
          >
            ✕
          </button>

          {/* ÁREA DE LA IMAGEN: Sin degradados y con visibilidad total */}
          <div className="relative w-full md:w-[45%] h-[50vh] md:h-full flex-shrink-0 bg-[#050505] flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
            <img 
              src={selectedHistoria.imagenUrl} 
              className="max-w-full max-h-full object-contain p-4 md:p-8" // 'contain' evita recortes, 'p' para que no toque los bordes
              alt={selectedHistoria.nombre} 
            />
          </div>

          {/* ÁREA DEL TEXTO: Scroll fluido y tipografía de lectura */}
          <div className="flex-1 bg-black relative md:h-full md:overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#f2c005]/20
            [&::-webkit-scrollbar-thumb]:rounded-full">
            
            <div className="max-w-2xl mx-auto px-6 md:px-12 py-10 md:py-24 space-y-8 md:space-y-12">
              <div className="space-y-4 border-b border-[#f2c005]/20 pb-8">
                <span className="text-[#f2c005] font-cinzel text-xs tracking-[0.5em] uppercase">{selectedHistoria.genero}</span>
                <h2 className="text-4xl md:text-6xl font-cinzel text-white leading-tight break-words">
                  {selectedHistoria.nombre}
                </h2>
              </div>
              
              <article>
                <p className="text-gray-200 leading-[2.2] md:leading-[2.5] text-lg md:text-xl whitespace-pre-wrap break-words font-light italic font-serif">
                  {selectedHistoria.texto}
                </p>
              </article>

              {/* APUNTE DEL AUTOR (Opcional) */}
              {selectedHistoria.comentario && (
                <div className="mt-12 md:mt-20 p-6 md:p-10 bg-white/5 rounded-3xl border border-white/10 relative">
                  <div className="absolute -top-3 left-6 bg-[#f2c005] text-black text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-tighter">
                    Apunte del Autor
                  </div>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed font-cinzel italic">
                    {selectedHistoria.comentario}
                  </p>
                </div>
              )}
              
              {/* Espacio final para que el scroll sea cómodo */}
              <div className="h-24 md:h-32" /> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
}