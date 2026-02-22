'use client';

import { useState, useEffect } from 'react';
import { db, auth, googleProvider } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
// IMPORTANTE: Aquí agregamos 'User' para que TypeScript no de error
import { onAuthStateChanged, signInWithPopup, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAdminEmails } from '@/lib/constants'; 

export default function MensajesContactoPage() {
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Ahora TypeScript reconocerá qué es 'User'
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      const adminEmails = getAdminEmails();

      setUser(currentUser); 

      if (currentUser && adminEmails.includes(currentUser.email || '')) {
        const q = query(collection(db, "mensajes_contacto"), orderBy("fecha", "desc"));
        
        // El onSnapshot debe estar dentro de una constante para poder desuscribirse
        const unsubscribeMsgs = onSnapshot(q, (snapshot) => {
          setMensajes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });

        return () => unsubscribeMsgs();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const marcarComoLeido = async (id: string, estadoActual: boolean) => {
    try {
      await updateDoc(doc(db, "mensajes_contacto", id), { leido: !estadoActual });
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const eliminarMensaje = async (id: string) => {
    if (confirm("¿Destruir esta misiva permanentemente?")) {
      try {
        await deleteDoc(doc(db, "mensajes_contacto", id));
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-[#f2c005] font-cinzel">
        Sincronizando con los mensajeros...
      </div>
    );
  }
 
  // Pantalla de Acceso Denegado
  if (!user || !getAdminEmails().includes(user.email || '')) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-lg shadow-2xl animate-in fade-in zoom-in duration-500">
          <h1 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Acceso Restringido</h1>
          <p className="text-slate-400 text-sm mb-8 font-medium italic">
            Las misivas de los lectores son privadas. Por favor, identifícate con la cuenta del autor para leerlas.
          </p>
          <button 
            onClick={() => signInWithPopup(auth, googleProvider)} 
            className="w-full bg-[#f2c005] text-black py-4 rounded-xl font-bold hover:bg-white transition shadow-lg shadow-[#f2c005]/20 active:scale-95 uppercase text-xs tracking-widest"
          >
            Identificarse
          </button>
          <Link href="/" className="block mt-6 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
            Volver al Reino
          </Link>
        </div>
      </div>
    );
  }

  // Pantalla de Administración (Si es Admin)
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-20 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Buzón de Misivas</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Saga Duangel • Mensajes de Lectores</p>
          </div>
          <button onClick={() => router.back()} className="text-xs font-black bg-slate-100 px-6 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
            VOLVER
          </button>
        </header>

        <div className="space-y-6">
          {mensajes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase text-xs">Aún no han llegado misivas al reino.</p>
            </div>
          ) : (
            mensajes.map((m) => (
              <div 
                key={m.id} 
                className={`bg-white p-8 rounded-[2.5rem] border-l-8 shadow-sm transition-all ${
                  m.leido ? 'border-slate-200 opacity-60' : 'border-[#f2c005] shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="font-black text-xl text-slate-900">{m.nombre}</h3>
                    <p className="text-blue-600 font-bold text-sm">{m.email}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">
                      {m.fecha?.toDate().toLocaleString() || 'Fecha desconocida'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => marcarComoLeido(m.id, m.leido)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                        m.leido ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'
                      }`}
                    >
                      {m.leido ? 'Marcar pendiente' : 'Marcar leído'}
                    </button>
                    <button 
                      onClick={() => eliminarMensaje(m.id)}
                      className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl italic text-slate-600 leading-relaxed border border-slate-100">
                  "{m.mensaje}"
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}