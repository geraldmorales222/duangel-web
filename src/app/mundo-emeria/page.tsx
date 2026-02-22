'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import InteractiveMap from "@/components/InteractiveMap";

/**
 * COMPONENTE INTERNO
 * Maneja la lógica de datos y pestañas
 */
function MundoEmeriaContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState('mapa');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // EFECTO 1: Sincronizar pestaña con la URL (Navbar -> Página)
  useEffect(() => {
    const tab = tabParam || 'mapa';
    setActiveTab(tab);
    setSelectedItem(null); // Cerrar modales al cambiar de categoría
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tabParam]);

  // EFECTO 2: Cargar datos de Firebase según la pestaña activa
  useEffect(() => {
    if (activeTab !== 'mapa') {
      const fetchData = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(db, `lore_${activeTab}`));
          setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) { 
          console.error("Error al invocar los anales:", error); 
        } finally { 
          setLoading(false); 
        }
      };
      fetchData();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen p-6 md:p-32 bg-black text-white relative">
      <div className="max-w-[1289px] mx-auto space-y-8">
        
        {/* CABECERA */}
        <div className="text-center space-y-4 pt-20 md:pt-0">
          <h1 className="text-5xl font-cinzel text-[#f2c005] tracking-tight">El Mundo de Emeria</h1>
          <p className="font-cinzel text-gray-400 tracking-[0.3em] text-xs uppercase">Saga Duangel — Roger Morales</p>
        </div>

        {/* NAV TABS */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-white/10 pb-6 sticky top-20 bg-black/90 z-40 py-2">
          {['mapa', 'personajes', 'criaturas', 'reinos', 'lugares'].map((tab) => (
            <button key={tab} 
              onClick={() => {
                setActiveTab(tab);
                // Actualizamos la URL sin recargar para mantener consistencia
                window.history.pushState(null, '', tab === 'mapa' ? '/mundo-emeria' : `/mundo-emeria?tab=${tab}`);
              }}
              className={`px-6 py-2 font-cinzel text-[10px] md:text-xs uppercase transition-all rounded-full border ${activeTab === tab ? 'bg-[#f2c005] text-black border-[#f2c005]' : 'border-white/20 text-gray-500 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENIDO DE GALERÍA */}
        <div className="w-full">
          {activeTab === 'mapa' ? (
            <div className="animate-in fade-in duration-700">
              <InteractiveMap />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loading ? (
                <div className="col-span-full py-20 text-center animate-pulse text-[#f2c005] font-cinzel text-xl uppercase tracking-widest">
                  Desplegando pergaminos sagrados...
                </div>
              ) : 
                items.map((item) => {
                  const esApaisado = activeTab === 'reinos' || activeTab === 'lugares';
                  return (
                    <div key={item.id} 
                      className="group relative flex flex-col bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-[#f2c005]/50 transition-all duration-300 shadow-xl">
                      <div className={`relative overflow-hidden ${esApaisado ? 'aspect-video' : 'aspect-[2/3]'}`}>
                        <img 
                          src={item.imagenUrl} 
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                          alt={item.nombre} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      </div>
                      <div className="p-5 flex flex-col flex-grow space-y-3">
                        <h2 className="text-2xl font-cinzel text-[#f2c005] leading-none truncate">{item.nombre}</h2>
                        <p className="text-xs text-gray-400 line-clamp-2 italic leading-relaxed uppercase tracking-tighter">{item.descripcion}</p>
                        <button 
                          onClick={() => setSelectedItem(item)}
                          className="mt-auto w-full bg-[#f2c005]/10 border border-[#f2c005]/30 text-[#f2c005] py-2.5 rounded-xl font-cinzel text-[10px] hover:bg-[#f2c005] hover:text-black transition-all uppercase tracking-widest font-bold">
                          Ver Crónica
                        </button>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CRÓNICA COMPLETA */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-10 bg-black/98 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-zinc-900 w-full h-full md:h-auto md:max-w-5xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl">
            
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 z-[210] bg-black/50 text-[#f2c005] w-12 h-12 rounded-full flex items-center justify-center border border-[#f2c005]/30 hover:bg-[#f2c005] hover:text-black transition-all shadow-lg">
              ✕
            </button>

            <div className={`relative w-full flex-shrink-0 bg-zinc-800 ${
              (activeTab === 'reinos' || activeTab === 'lugares') ? 'md:w-[550px] h-[35vh] md:h-auto' : 'md:w-[400px] h-[40vh] md:h-auto'
            }`}>
              <img src={selectedItem.imagenUrl} className="w-full h-full object-cover" alt={selectedItem.nombre} />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent md:hidden" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 
                [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#f2c005]/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              <div className="border-b border-white/10 pb-6 pr-10 md:pr-0">
                <h2 className="text-4xl md:text-5xl font-cinzel text-[#f2c005] leading-none mb-2">{selectedItem.nombre}</h2>
                {selectedItem.apodo && (
                  <p className="text-[#f2c005]/60 font-cinzel italic text-base md:text-lg tracking-wide">"{selectedItem.apodo}"</p>
                )}
              </div>

              <div className="space-y-6">
                {(activeTab === 'personajes' || activeTab === 'criaturas') && (
                  <div className="grid grid-cols-2 gap-6 bg-white/5 p-5 rounded-2xl border border-white/5">
                    {activeTab === 'personajes' ? (
                      <>
                        <div><label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Linaje</label><p className="text-sm text-gray-200">{selectedItem.linaje || 'Desconocido'}</p></div>
                        <div><label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Sangre</label><p className="text-sm text-gray-200">{selectedItem.sangre || 'Pura'}</p></div>
                      </>
                    ) : (
                      <>
                        <div><label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Origen</label><p className="text-sm text-gray-200">{selectedItem.origen}</p></div>
                        <div><label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Hábitat</label><p className="text-sm text-gray-200">{selectedItem.habitat}</p></div>
                      </>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] text-blue-500 uppercase font-black tracking-widest block font-cinzel">
                    {(activeTab === 'personajes' || activeTab === 'criaturas') ? 'Poderes y Habilidades' : 'Descripción General'}
                  </label>
                  <p className={`${(activeTab === 'personajes' || activeTab === 'criaturas') ? 'text-[#f2c005] text-lg' : 'text-gray-200 text-sm'} font-medium leading-relaxed italic`}>
                    {selectedItem.habilidades || selectedItem.descripcion}
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4 mb-10">
                  <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/10 pb-2 font-cinzel">
                    {activeTab === 'personajes' ? 'Crónica Biográfica' : 
                     activeTab === 'criaturas' ? 'Relato de la Especie' : 
                     activeTab === 'reinos' ? 'Anales del Reino' : 'Memoria del Lugar'}
                  </label>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                    {selectedItem.biografia || selectedItem.historia || selectedItem.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * EXPORTACIÓN PRINCIPAL
 * Envuelto en Suspense por el uso de useSearchParams
 */
export default function MundoEmeriaPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-[#f2c005] font-cinzel">Invocando el saber de Emeria...</div>}>
      <MundoEmeriaContent />
    </Suspense>
  );
}