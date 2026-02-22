'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ArtePage() {
  const [artes, setArtes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState<any | null>(null);

  useEffect(() => {
    const fetchArtes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "arte_conceptual"));
        setArtes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchArtes();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-24 bg-black text-white relative">
      {/* Padding top para que el Navbar no corte el título principal */}
      <h1 className="text-4xl md:text-5xl font-cinzel text-[#f2c005] text-center mb-16 pt-20 md:pt-0  tracking-tighter">
        Visiones de Emeria
      </h1>
      
      {loading ? (
        <div className="text-center animate-pulse font-cinzel text-gray-600 uppercase tracking-[0.3em]">
          Revelando visiones...
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto px-2">
          {artes.map((arte) => (
            <div 
              key={arte.id}
              onClick={() => setViewImage(arte)}
              className="break-inside-avoid bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-[#f2c005]/50 transition-all cursor-pointer group relative"
            >
              <img 
                src={arte.imagenUrl} 
                alt={arte.nombre} 
                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <h3 className="font-medieval text-[#f2c005] text-xl truncate">{arte.nombre}</h3>
                <p className="text-gray-400 text-[10px] line-clamp-2 italic mb-2">"{arte.texto}"</p>
                <p className="text-[10px] font-cinzel text-white uppercase tracking-widest border-t border-white/10 pt-2 w-fit">Invocando Visión</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISOR DE ARTE INMERSIVO - REINGENIERÍA PARA CELULAR */}
      {viewImage && (
        <div className="fixed inset-0 z-[300] bg-black animate-in fade-in duration-300 flex flex-col overflow-y-auto md:overflow-hidden">
          
          {/* BOTÓN CERRAR - SIEMPRE ARRIBA A LA DERECHA */}
          <button 
            onClick={() => setViewImage(null)} 
            className="fixed top-6 right-6 z-[400] bg-black/80 text-[#f2c005] w-12 h-12 rounded-full flex items-center justify-center border border-[#f2c005]/40 backdrop-blur-md shadow-2xl active:scale-90"
          >
            ✕
          </button>

          <div className="flex flex-col md:flex-row h-full">
            
            {/* CONTENEDOR DE IMAGEN (ARRIBA EN MÓVIL) */}
            <div className="relative w-full md:w-[65%] h-[50vh] md:h-full bg-zinc-950 flex-shrink-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
              <img 
                src={viewImage.imagenUrl} 
                className="max-h-full max-w-full object-contain md:p-8" 
                alt={viewImage.nombre} 
              />
              {/* Gradiente solo en móvil para fundir con el texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:hidden" />
            </div>

            {/* CONTENEDOR DE TEXTO (SCROLLABLE INDEPENDIENTE) */}
            <div className="flex-1 p-8 md:p-16 overflow-y-auto bg-black
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-[#f2c005]/20
              [&::-webkit-scrollbar-thumb]:rounded-full">
              
              <div className="max-w-prose space-y-8">
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-6xl font-cinzel text-[#f2c005] leading-tight break-words">
                    {viewImage.nombre}
                  </h2>
                  <div className="w-16 h-1 bg-[#f2c005]/40 rounded-full" />
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 block">Descripción de la Visión</label>
                    <p className="text-gray-200 text-lg leading-relaxed italic whitespace-pre-wrap break-words font-light">
                      "{viewImage.texto}"
                    </p>
                  </div>

                  {viewImage.comentario && (
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 relative group">
                      <div className="absolute -top-3 left-8 bg-[#f2c005] text-black text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-tighter">
                        Nota del Ilustrador
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed font-cinzel italic break-words">
                        {viewImage.comentario}
                      </p>
                    </div>
                  )}
                </div>

                <div className="h-24 md:hidden" /> {/* Espaciador final para móvil */}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}