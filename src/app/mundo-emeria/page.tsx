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

  // EFECTO 1: Sincronizar pestaña con la URL
  useEffect(() => {
    const tab = tabParam || 'mapa';
    setActiveTab(tab);
    setSelectedItem(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tabParam]);

  // EFECTO 2: Cargar datos de Firebase
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
              ) : (
                items.map((item) => {
                  // Lógica condicional para fotos apaisadas
                  const esPaisaje = activeTab === 'reinos' || activeTab === 'lugares';

                  return (
                    <div key={item.id} 
                      className="group relative flex flex-col bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-[#f2c005]/50 transition-all duration-300 shadow-xl"
                    >
                      {/* CONTENEDOR DE IMAGEN */}
                      <div className={`relative overflow-hidden bg-black/20 ${esPaisaje ? 'aspect-[3/2]' : 'aspect-[2/3]'}`}>
                        <img 
                          src={item.imagenUrl} 
                          className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${esPaisaje ? 'object-contain p-2' : 'object-cover'}`} 
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CRÓNICA COMPLETA */}
      {selectedItem && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-2 md:p-10 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          
          {/* BOTÓN CERRAR - Siempre visible */}
          <button 
            onClick={() => setSelectedItem(null)} 
            className="fixed top-4 right-4 z-[600] bg-[#f2c005] text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all font-bold text-xl"
          >
            ✕
          </button>

          {/* CONTENEDOR PRINCIPAL */}
          <div className={`bg-zinc-950 w-full max-w-6xl h-full md:h-auto max-h-[92vh] rounded-3xl overflow-hidden flex flex-col relative border border-white/10 shadow-2xl ${
            (activeTab === 'reinos' || activeTab === 'lugares') ? 'md:flex-col' : 'md:flex-row'
          }`}>
            
            {/* SECCIÓN DE IMAGEN: Ajuste para NO CORTAR la foto en móvil */}
            <div className={`relative bg-black flex items-center justify-center shrink-0 overflow-hidden ${
              (activeTab === 'reinos' || activeTab === 'lugares') 
                ? 'w-full h-[30vh] md:h-[450px]' 
                : 'w-full md:w-[400px] h-[50vh] md:h-auto' // En móvil le damos un 50% de la pantalla
            }`}>
              <img 
                src={selectedItem.imagenUrl} 
                className={`w-full h-full transition-all duration-500 ${
                  (activeTab === 'reinos' || activeTab === 'lugares') 
                    ? 'object-contain px-4' 
                    : 'object-contain md:object-cover p-2 md:p-0' // 'object-contain p-2' evita que se corte en celular
                }`} 
                alt={selectedItem.nombre} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent md:hidden" />
            </div>

            {/* SECCIÓN DE CONTENIDO (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#f2c005]/20">
              
              {/* Encabezado */}
              <div className="border-b border-white/10 pb-4 pr-8">
                <h2 className="text-3xl md:text-5xl font-cinzel text-[#f2c005] leading-tight mb-1">{selectedItem.nombre}</h2>
                {selectedItem.apodo && (
                  <p className="text-[#f2c005]/60 font-cinzel italic text-sm md:text-lg tracking-wide">"{selectedItem.apodo}"</p>
                )}
              </div>

              <div className={`grid grid-cols-1 gap-8 ${(activeTab === 'reinos' || activeTab === 'lugares') ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                <div className="space-y-6">
                  {/* Descripción */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-blue-500 uppercase font-black tracking-widest block font-cinzel">
                      {(activeTab === 'personajes' || activeTab === 'criaturas') ? 'Naturaleza y Poder' : 'Esencia del Lugar'}
                    </label>
                    <p className={`${(activeTab === 'personajes' || activeTab === 'criaturas') ? 'text-[#f2c005] text-lg' : 'text-gray-200 text-sm'} font-medium leading-relaxed italic border-l-2 border-[#f2c005]/30 pl-4`}>
                      {selectedItem.habilidades || selectedItem.descripcion}
                    </p>
                  </div>

                  {/* Ficha Técnica y Crónica DEBAJO */}
                  {(activeTab === 'personajes' || activeTab === 'criaturas') && (
                    <>
                      <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
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

                      <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/10 pb-2 font-cinzel">
                          {activeTab === 'personajes' ? 'Crónica Biográfica' : 'Relato de la Especie'}
                        </label>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                          {selectedItem.biografia || selectedItem.historia || selectedItem.descripcion}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Crónica para Reinos/Lugares */}
                {(activeTab === 'reinos' || activeTab === 'lugares') && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block border-b border-white/10 pb-2 font-cinzel">
                      {activeTab === 'reinos' ? 'Anales del Reino' : 'Memoria del Lugar'}
                    </label>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                      {selectedItem.biografia || selectedItem.historia || selectedItem.descripcion}
                    </p>
                  </div>
                )}
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
 */
export default function MundoEmeriaPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-[#f2c005] font-cinzel">Invocando el saber de Emeria...</div>}>
      <MundoEmeriaContent />
    </Suspense>
  );
}