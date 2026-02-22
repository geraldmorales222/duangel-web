'use client';

import { useState, useEffect } from 'react';
import { db, auth, googleProvider } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  where, 
  limit 
} from 'firebase/firestore';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';

export default function BlogPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    fetchData();
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const qPosts = query(collection(db, "blog"), orderBy("fecha", "desc"));
      const postSnap = await getDocs(qPosts);
      setPosts(postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const qComents = query(
        collection(db, "comentarios"), 
        where("estado", "==", "aprobado"), 
        orderBy("fecha", "desc")
      );
      const comentSnap = await getDocs(qComents);
      setComentarios(comentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Error al sincronizar con el Oráculo:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarComentario = async (postId: string) => {
    if (!user || !nuevoMensaje.trim()) return;
    setEnviando(true);
    
    try {
      const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const qCheck = query(
        collection(db, "comentarios"),
        where("uid", "==", user.uid),
        orderBy("fecha", "desc"),
        limit(1)
      );
      
      const checkSnap = await getDocs(qCheck);
      
      if (!checkSnap.empty) {
        const ultimoDoc = checkSnap.docs[0].data();
        const fechaUltimo = ultimoDoc.fecha?.toDate(); 
        if (fechaUltimo && fechaUltimo > hace24h) {
          alert("Has agotado tu energía por hoy. Solo se permite una misiva cada 24 horas.");
          setEnviando(false);
          return;
        }
      }

      await addDoc(collection(db, "comentarios"), {
        postId: postId,
        uid: user.uid,
        usuario: user.displayName,
        foto: user.photoURL,
        mensaje: nuevoMensaje.trim(),
        fecha: serverTimestamp(),
        estado: "pendiente",
        respuesta: ""
      });

      alert("Misiva entregada al Oráculo.");
      setNuevoMensaje('');
    } catch (e: any) {
      console.error("ERROR CRÍTICO FIREBASE:", e);
      alert("Error al enviar. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-24 bg-black text-white">
      <div className="max-w-4xl mx-auto space-y-12 pt-20 md:pt-0"> {/* pt-20 evita que el Navbar tape el título */}
        
        {/* CABECERA */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-cinzel text-[#f2c005] tracking-tight">Noticias del Autor</h1>
          <p className="font-cinzel text-gray-500 text-[10px] tracking-[0.4em] uppercase">Crónicas y Ecos de la Saga</p>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-[#f2c005] font-cinzel tracking-widest uppercase text-xs">Sincronizando con Emeria...</div>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <div key={post.id} className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl transition-all hover:bg-zinc-900/60">
                <div className="flex flex-col md:flex-row">
                  
                  {/* IMAGEN MINIATURA - Ajustada para móviles */}
                  <div className="w-full md:w-72 h-64 md:h-auto flex-shrink-0 relative border-b md:border-b-0 md:border-r border-white/5">
                    <img src={post.imagenUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt={post.nombre} />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* CONTENIDO COMPACTO */}
                  <div className="p-6 md:p-8 flex flex-col justify-center flex-1 space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="text-[#f2c005] font-cinzel text-[8px] md:text-[9px] tracking-widest uppercase py-1 px-3 bg-white/5 rounded-full border border-white/10">
                        {post.subnombre || 'Crónica'}
                      </span>
                      <span className="text-gray-600 text-[9px] font-bold font-cinzel">
                        {new Date(post.fecha?.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-cinzel text-white leading-tight">{post.nombre}</h2>
                    <p className="text-gray-400 text-sm italic font-light line-clamp-2 md:line-clamp-3">"{post.descripcion}"</p>
                    
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <button 
                        onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                        className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#f2c005] hover:text-white transition-all flex items-center gap-2 w-fit"
                      >
                        {activePostId === post.id ? 'Cerrar Archivo ↑' : 'Leer Ecos y Comentar ↓'}
                      </button>
                      <div className="text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest italic border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                        Por Roger Morales
                      </div>
                    </div>
                  </div>
                </div>

                {/* ÁREA DESPLEGABLE DE LECTURA Y COMENTARIOS */}
                {activePostId === post.id && (
                  <div className="p-6 md:p-12 bg-black/60 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                    <div className="max-w-2xl mx-auto space-y-10">
                      
                      {/* TEXTO COMPLETO DE LA NOTICIA */}
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed md:leading-loose whitespace-pre-wrap italic font-light">
                          {post.texto}
                        </p>
                      </div>

                      <div className="h-px bg-white/5 w-full" />

                      {/* SECCIÓN DE COMENTARIOS */}
                      <div className="space-y-8">
                        <h4 className="text-center font-cinezl text-[#f2c005] text-xl md:text-2xl uppercase tracking-wider">Ecos de este relato</h4>

                        {!user ? (
                          <button 
                            onClick={() => signInWithPopup(auth, googleProvider)} 
                            className="w-full py-4 bg-white/5 border border-white/10 text-gray-500 font-cinzel text-[9px] rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-widest"
                          >
                            Identifícate con Google para comentar
                          </button>
                        ) : (
                          <div className="bg-zinc-900/50 p-5 rounded-3xl border border-[#f2c005]/10 space-y-4">
                            <textarea 
                              value={nuevoMensaje}
                              onChange={(e) => setNuevoMensaje(e.target.value)}
                              placeholder="¿Qué ecos resuenan en tu mente?"
                              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-[#f2c005] transition-all text-gray-200"
                              rows={3}
                            />
                            <button 
                              disabled={enviando}
                              onClick={() => handleEnviarComentario(post.id)}
                              className="w-full py-4 bg-[#f2c005] text-black font-black font-cinzel text-[10px] rounded-2xl uppercase tracking-[0.2em] shadow-lg disabled:bg-zinc-800 disabled:text-gray-500"
                            >
                              {enviando ? "Entregando..." : "Enviar Comentario"}
                            </button>
                          </div>
                        )}

                        <div className="space-y-6">
                          {comentarios.filter(c => c.postId === post.id).map(c => (
                            <div key={c.id} className="p-5 md:p-6 bg-white/5 rounded-[1.5rem] border border-white/5 space-y-4">
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  {c.foto && <img src={c.foto} className="w-5 h-5 md:w-6 md:h-6 rounded-full grayscale opacity-70" alt="U" />}
                                  <span className="text-[9px] md:text-[10px] font-cinzel text-[#f2c005] uppercase tracking-widest">{c.usuario}</span>
                                </div>
                                <span className="text-[8px] text-gray-700 font-bold">{new Date(c.fecha?.seconds * 1000).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-300 text-sm italic font-light leading-relaxed">"{c.mensaje}"</p>
                              
                              {c.respuesta && (
                                <div className="mt-4 ml-4 md:ml-6 p-4 md:p-5 bg-[#f2c005]/5 border-l-2 border-[#f2c005] rounded-r-2xl">
                                  <label className="text-[7px] md:text-[8px] font-black text-[#f2c005] uppercase tracking-widest mb-1 block">Respuesta de Roger Morales</label>
                                  <p className="text-gray-400 text-xs md:text-[12px] leading-relaxed italic">{c.respuesta}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}