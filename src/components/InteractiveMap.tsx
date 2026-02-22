'use client';

import { useState, useRef, useEffect } from 'react';

const ubicacionesEmeria = [
  { id: 1, x: '39.5%', y: '36%', nombre: 'Fuerte Nortland', desc: 'Bastión principal del norte, vigilando el Estrecho de la Desesperanza.' },
  { id: 2, x: '25.5%', y: '39.9%', nombre: 'Meseta Monthegar', desc: 'Tierras altas rodeadas por el Río Iris.' },
  { id: 3, x: '43%', y: '49.8%', nombre: 'Fortaleza de Bardas', desc: 'Capital y punto estratégico que separa la Bahía del Fuego de las Tierras de Kilykur.' },
  { id: 4, x: '47.8%', y: '57.8%', nombre: 'Kilykur', desc: 'Reino estratégico, donde se ubican los yacimiento de Cristales de luz.' },
  { id: 5, x: '60%', y: '49%', nombre: 'Valle de los Soles', desc: 'Region fértil bendecida por la luz del sol y el resguardo de las montañas.' },
  { id: 6, x: '74.7%', y: '45.2%', nombre: 'Bosques de Griden', desc: 'Extensa zona forestal que custodia el castillo El Roble.' },
  { id: 7, x: '59.5%', y: '60.8%', nombre: 'Valle de las Colinas Hermanas', desc: 'Tierras fértiles ubicadas al sur de las montañas de la Runas.' },
  { id: 8, x: '85.7%', y: '43.2%', nombre: 'Puerto Dorado', desc: 'Principal salida comercial al Mar del Sol.' },
  { id: 9, x: '42.7%', y: '25.7%', nombre: 'Puerto Las Rocas', desc: 'Muelle septentrional frente al Mar de los Témpanos.' },
  { id: 10, x: '42.5%', y: '65.5%', nombre: 'Puerto Cristal', desc: 'Ciudad costera famosa por sus aguas claras en el Mar de Cristal.' },
  { id: 11, x: '62.5%', y: '63.5%', nombre: 'Puerto Las Espadas', desc: 'Guarnición marítima que protege el sur del continente.' },
  { id: 12, x: '49.4%', y: '76.1%', nombre: 'Estrecho de las Sombras', desc: 'Paso estrecho que conduce a las peligrosas Tierras Oscuras.' },
  { id: 13, x: '55.5%', y: '82.5%', nombre: 'Tierras Oscuras', desc: 'Territorio poco explorado, envuelto por el misterio y el peligro que lo rodea.' },
  { id: 14, x: '45%', y: '85%', nombre: 'Desiertos de Dunnas', desc: 'Vastas extensiones de arena en el extremo suroeste.' },
  { id: 15, x: '40%', y: '45.3%', nombre: 'Abismo del Último Aliento', desc: 'Se dio lugar a la batalla del Trueno. Donde las tropas del Caído del cielo fueron derrotadas.' },
  { id: 16, x: '44.9%', y: '64.2%', nombre: 'Minas de Luxember', desc: 'Yacimiento minero donde se extraer los codiciados Cristales de Luz.' },
  { id: 17, x: '50.1%', y: '64.7%', nombre: 'Pueblo de Darlia', desc: 'Humilde asentamiento, donde se respiraba la paz, hasta...' },
  { id: 18, x: '60.4%', y: '38.7%', nombre: 'Montañas del Alto', desc: 'Refugio natural donde en sus cimas se ubica el templo de Adaluz' },
  { id: 19, x: '52.4%', y: '35.7%', nombre: 'Planicies de Golas', desc: 'Zona desértica donde se ubican las ruinas de la cuidad de Golas' },
  { id: 20, x: '70.4%', y: '85.7%', nombre: 'Montañas del abandono', desc: 'Tierras inhóspitas donde merodean los seres de la oscuridad' },

];

export default function InteractiveMap() {
  const [seleccion, setSeleccion] = useState<any | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setSeleccion(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-10" ref={mapRef}>
      <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl bg-zinc-950">
        
        <img 
          src="/images/mapa.webp" 
          alt="Mapa de Emeria"
          className="w-full h-auto block select-none pointer-events-none"
          draggable="false"
        />

        <div className="absolute inset-0">
          {ubicacionesEmeria.map((punto) => {
            const esSeleccionado = seleccion?.id === punto.id;
            const xFloat = parseFloat(punto.x);
            const yFloat = parseFloat(punto.y);

            // LOGICA DE POSICIONAMIENTO
            const aparecerAbajo = yFloat < 45; // Si está arriba, abre hacia abajo
            const muyIzquierda = xFloat < 30;  // Si está muy a la izquierda
            const muyDerecha = xFloat > 70;    // Si está muy a la derecha
            
            return (
              <div
                key={punto.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: punto.x, 
                  top: punto.y, 
                  zIndex: esSeleccionado ? 100 : 20 
                }}
              >
                <div className="relative flex items-center justify-center">
                  
                  {/* MARCADOR */}
                  <div 
                    onClick={() => setSeleccion(esSeleccionado ? null : punto)}
                    className="cursor-pointer relative z-10 p-4"
                  >
                    <div className={`absolute inset-0 bg-[#f2c005] rounded-full animate-ping opacity-10 ${esSeleccionado ? 'scale-150' : 'scale-0'}`} />
                    <div className={`w-3 h-3 md:w-5 md:h-5 rounded-full border-2 border-black shadow-lg transition-all duration-300 ${esSeleccionado ? 'bg-white scale-125 shadow-[0_0_15px_#f2c005]' : 'bg-[#f2c005]'}`} />
                  </div>

                  {/* TOOLTIP DINÁMICO TOTAL (360°) */}
                  {esSeleccionado && (
                    <div 
                      className={`absolute w-[75vw] max-w-[260px] md:w-80 pointer-events-auto z-50 transition-all duration-300
                        ${aparecerAbajo ? 'top-full mt-4' : 'bottom-full mb-4'}
                        ${muyIzquierda ? 'left-0 translate-x-0' : muyDerecha ? 'right-0 translate-x-0' : 'left-1/2 -translate-x-1/2'}
                      `}
                    >
                      <div className="bg-black/95 backdrop-blur-xl border border-[#f2c005]/40 p-5 md:p-6 rounded-[2rem] shadow-2xl">
                        
                        {/* Triángulo dinámico: Se oculta en bordes para no verse mal si el cuadro se desplaza */}
                        {!muyIzquierda && !muyDerecha && (
                          <div className={`absolute left-1/2 -translate-x-1/2 border-8 border-transparent 
                            ${aparecerAbajo ? 'bottom-full border-b-black/95' : 'top-full border-t-black/95'}`} 
                          />
                        )}
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="pr-4">
                              <span className="text-[#f2c005] font-cinzel text-[7px] tracking-[0.4em] uppercase opacity-60 block">Exploración</span>
                              <h3 className="font-medieval text-xl md:text-2xl text-white leading-tight break-words">{punto.nombre}</h3>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setSeleccion(null); }} className="text-gray-500 hover:text-white flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          </div>
                          
                          <p className="text-gray-400 font-cinzel text-[10px] md:text-xs leading-relaxed italic">
                            "{punto.desc}"
                          </p>
                          
                          
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-0 pointer-events-none border-[8px] md:border-[12px] border-black/20 rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />
      </div>
    </div>
  );
}