'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaInstagram, FaTiktok, FaYoutube, FaPinterest, FaEnvelope } from 'react-icons/fa'; 

export default function ContactoPage() {
  const [enviando, setEnviando] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });

  const redes = [
    { name: 'Instagram', icon: <FaInstagram />, link: 'https://instagram.com/duangel_el_caido_de_los_cielos', color: 'hover:text-pink-500' },
    { name: 'TikTok', icon: <FaTiktok />, link: 'https://tiktok.com/@duangel.el.caido.del.c', color: 'hover:text-cyan-400' },
    { name: 'Pinterest', icon: <FaPinterest />, link: 'https://pinterest.com/duangelelcadodeloscielos', color: 'hover:text-red-600' },
    { name: 'YouTube', icon: <FaYoutube />, link: 'https://youtube.com/@Duangelelcaídodeloscielos', color: 'hover:text-red-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await addDoc(collection(db, "mensajes_contacto"), {
        ...formData,
        fecha: serverTimestamp(),
        leido: false
      });
      setFormData({ nombre: '', email: '', mensaje: '' });
      alert("La misiva ha sido entregada al mensajero de Emeria.");
    } catch (error) {
      console.error(error);
      alert("Error al enviar la misiva. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 md:p-20 pt-32 md:pt-40">
      
      {/* Título de Sección Responsivo */}
      <div className="text-center mb-12 md:mb-16 space-y-4 w-full max-w-4xl">
        {/* Cambiado de text-5xl a text-3xl en móvil y text-5xl en PC */}
        <h1 className="text-3xl md:text-5xl font-cinzel text-[#f2c005] tracking-widest break-words md:break-normal">
          Canales de Comunicación
        </h1>
        <p className="font-cinzel text-gray-500 text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.4em] uppercase px-4 leading-relaxed">
          Conecta con los anales de la saga a través de los espejos mágicos
        </p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* COLUMNA 1: FORMULARIO */}
        <div className="bg-zinc-900/50 p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-sm order-2 lg:order-1">
          <h2 className="text-xl md:text-2xl font-cinzel text-white mb-8 flex items-center gap-3">
            <FaEnvelope className="text-[#f2c005] text-sm" /> Redactar Misiva
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-cinzel text-[10px] text-gray-500 tracking-widest uppercase ml-1 italic">Nombre o Título</label>
              <input 
                type="text" 
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#f2c005] outline-none transition-all placeholder:text-gray-700"
                placeholder="Ej: Caballero de Emeria"
              />
            </div>

            <div className="space-y-2">
              <label className="font-cinzel text-[10px] text-gray-500 tracking-widest uppercase ml-1 italic">Tu Correo</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#f2c005] outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-cinzel text-[10px] text-gray-500 tracking-widest uppercase ml-1 italic">Mensaje</label>
              <textarea 
                rows={4} 
                required
                value={formData.mensaje}
                onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#f2c005] outline-none transition-all"
                placeholder="Escribe aquí tus palabras..."
              />
            </div>

            <button 
              disabled={enviando}
              type="submit"
              className="w-full bg-[#f2c005] text-black font-black py-4 rounded-2xl hover:bg-white transition-all disabled:bg-gray-600 active:scale-95 shadow-lg shadow-[#f2c005]/10 flex items-center justify-center"
            >
              <span className="font-cinzel tracking-widest text-xs uppercase">
                {enviando ? 'Enviando Misiva...' : 'Entregar al Mensajero'}
              </span>
            </button>
          </form>
        </div>

        {/* COLUMNA 2: INFO Y REDES */}
        <div className="flex flex-col justify-center space-y-6 md:space-y-10 order-1 lg:order-2">
          
          <div className="group p-6 md:p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-[#f2c005]/30 transition-all">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 block">Correo Oficial</label>
            <p className="font-cinzel text-[#f2c005] text-sm md:text-base break-all md:break-words">
              duangelelcaidodeloscielos@gmail.com
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {redes.map((red) => (
              <a 
                key={red.name} 
                href={red.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-2xl border border-white/5 transition-all group ${red.color}`}
              >
                <span className="text-2xl md:text-3xl transition-transform group-hover:scale-110">{red.icon}</span>
                <span className="font-cinzel text-[9px] md:text-[10px] tracking-widest uppercase text-gray-400 group-hover:text-white">
                  {red.name}
                </span>
              </a>
            ))}
          </div>

          <div className="italic text-gray-500 font-light text-center lg:text-left pt-6 border-t border-white/5 leading-relaxed text-xs">
            "Que la luz de los antiguos guíe tus palabras hacia los Anales de Emeria."
          </div>
        </div>
      </div>
    </div>
  );
}