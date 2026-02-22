'use client';

import { useState, useEffect } from 'react';
import { db, auth, googleProvider } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import { getAdminEmails } from '@/lib/constants';

export default function AdminBlogPage() {
  const [user, setUser] = useState<User | null>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  
  // Filtro de selección
  const [noticiaSeleccionadaId, setNoticiaSeleccionadaId] = useState<string | null>(null);

  // Estado para Crear/Editar
  const [noticiaForm, setNoticiaForm] = useState({ nombre: '', subnombre: '', descripcion: '', texto: '' });
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Estado para Respuestas
  const [respuestaTexto, setRespuestaTexto] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const adminEmails = getAdminEmails();

      // Solo cargamos datos si es admin, pero NO redirigimos con router.push
      if (currentUser && adminEmails.includes(currentUser.email || '')) {
        fetchAllData();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    const qCom = query(collection(db, "comentarios"), orderBy("fecha", "desc"));
    const snapCom = await getDocs(qCom);
    setComentarios(snapCom.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const qBlog = query(collection(db, "blog"), orderBy("fecha", "desc"));
    const snapBlog = await getDocs(qBlog);
    setNoticias(snapBlog.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSubirImagen = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "emeria_preset");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
    const cloudData = await res.json();
    return cloudData.secure_url;
  };

  const handleGuardarNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubiendo(true);
    try {
      let finalImageUrl = editandoId ? noticias.find(n => n.id === editandoId).imagenUrl : "";
      
      if (imagenArchivo) {
        finalImageUrl = await handleSubirImagen(imagenArchivo);
      } else if (!editandoId) {
        return alert("Selecciona una imagen para la nueva noticia");
      }

      const data = { ...noticiaForm, imagenUrl: finalImageUrl, fecha: serverTimestamp() };

      if (editandoId) {
        await updateDoc(doc(db, "blog", editandoId), data);
        alert("Crónica actualizada.");
      } else {
        await addDoc(collection(db, "blog"), { ...data, autor: "Roger Morales" });
        alert("Noticia publicada.");
      }

      resetForm();
      fetchAllData();
    } catch (error) { alert("Error en el proceso."); }
    finally { setSubiendo(false); }
  };

  const resetForm = () => {
    setNoticiaForm({ nombre: '', subnombre: '', descripcion: '', texto: '' });
    setImagenArchivo(null);
    setPreviewUrl(null);
    setEditandoId(null);
  };

  const openEdit = (n: any) => {
    setEditandoId(n.id);
    setNoticiaSeleccionadaId(n.id); // Al editar, filtramos comentarios automáticamente
    setNoticiaForm({ nombre: n.nombre, subnombre: n.subnombre, descripcion: n.descripcion, texto: n.texto });
    setPreviewUrl(n.imagenUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejo de preview de imagen local
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagenArchivo(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAprobar = async (id: string) => {
    await updateDoc(doc(db, "comentarios", id), { estado: 'aprobado' });
    fetchAllData();
  };

  const handleResponder = async (id: string) => {
    if (!respuestaTexto[id]) return alert("Escribe respuesta.");
    await updateDoc(doc(db, "comentarios", id), { respuesta: respuestaTexto[id], estado: 'aprobado' });
    alert("Respuesta enviada.");
    fetchAllData();
  };

  const handleEliminar = async (col: string, id: string) => {
    if (confirm("¿Confirmas la eliminación definitiva?")) {
      await deleteDoc(doc(db, col, id));
      fetchAllData();
    }
  };

  // Lógica de Filtrado de Comentarios
  const comentariosFiltrados = noticiaSeleccionadaId 
    ? comentarios.filter(c => c.postId === noticiaSeleccionadaId)
    : comentarios;

  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white font-mono uppercase tracking-[0.5em]">Accediendo al Oráculo...</div>;

  if (!user || !getAdminEmails().includes(user.email || '')) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-lg shadow-2xl animate-in fade-in zoom-in duration-500">
          <h1 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Acceso Restringido</h1>
          <p className="text-slate-400 text-sm mb-8 font-medium italic">
            No tienes permisos para gestionar las crónicas de Emeria. Por favor, identifícate con una cuenta autorizada.
          </p>
          <button 
            onClick={() => signInWithPopup(auth, googleProvider)} 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Identificarse
          </button>
          <Link href="/" className="block mt-6 text-xs font-bold text-slate-500 hover:text-[#f2c005] uppercase tracking-widest transition-colors">
            Volver al Reino
          </Link>
        </div>
      </div>
    );
  }
  const inputStyle = "w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all text-sm bg-slate-50 text-slate-900 font-medium";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto pt-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Panel de Crónicas</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em]">Saga Duangel • Administración</p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
             <button onClick={() => setNoticiaSeleccionadaId(null)} className="text-[10px] font-bold uppercase underline text-slate-400 hover:text-blue-600">Ver todos los comentarios</button>
             <Link href="/panel-administrativo-duangel">
               <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] hover:bg-blue-700 transition-all uppercase shadow-lg shadow-blue-900/10">← Volver</button>
             </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* EDITOR (Izquierda) */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-4 text-center text-white font-black text-[9px] uppercase tracking-[0.4em]">
                {editandoId ? 'Modificando Registro Histórico' : 'Redactar Nueva Entrada del Blog'}
              </div>
              
              <form onSubmit={handleGuardarNoticia} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Título de la Crónica" className={inputStyle} value={noticiaForm.nombre} onChange={(e) => setNoticiaForm({...noticiaForm, nombre: e.target.value})} required />
                  <input placeholder="Epígrafe / Subtítulo" className={inputStyle} value={noticiaForm.subnombre} onChange={(e) => setNoticiaForm({...noticiaForm, subnombre: e.target.value})} />
                </div>
                
                <textarea placeholder="Breve Introducción (Para la card)" className={`${inputStyle} h-24`} value={noticiaForm.descripcion} onChange={(e) => setNoticiaForm({...noticiaForm, descripcion: e.target.value})} required />
                <textarea placeholder="Cuerpo Completo del Relato..." className={`${inputStyle} h-64`} value={noticiaForm.texto} onChange={(e) => setNoticiaForm({...noticiaForm, texto: e.target.value})} required />
                
                {/* SUBIDA DE IMAGEN CON PREVIEW */}
                <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                   <div className="flex flex-col md:flex-row items-center gap-6">
                      {previewUrl && <img src={previewUrl} className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl" />}
                      <div className="flex-1 space-y-2 text-center md:text-left">
                         <label className="text-[10px] font-black text-slate-500 uppercase block">Imagen de Portada (Obligatorio)</label>
                         <input type="file" className="text-xs file:bg-blue-50 file:border-0 file:px-4 file:py-2 file:rounded-full file:text-blue-600 file:font-bold cursor-pointer" onChange={handleFileChange} />
                         <p className="text-[8px] text-slate-400">Formatos: JPG, PNG o WEBP. Tamaño máximo sugerido: 2MB.</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button disabled={subiendo} className="flex-1 py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-slate-900 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200">
                    {subiendo ? 'Subiendo a los Anales...' : editandoId ? 'Guardar Cambios' : 'Publicar Crónica'}
                  </button>
                  {editandoId && (
                    <button type="button" onClick={resetForm} className="px-8 bg-slate-200 text-slate-600 rounded-[1.5rem] font-bold text-[10px] uppercase">Cancelar</button>
                  )}
                </div>
              </form>
            </section>

            {/* LISTA DE NOTICIAS */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Registros en la Base de Datos
              </h2>
              {noticias.map((n) => (
                <div 
                  key={n.id} 
                  className={`bg-white p-5 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-6 ${noticiaSeleccionadaId === n.id ? 'border-blue-500 shadow-lg' : 'border-transparent shadow-sm hover:border-slate-200'}`}
                  onClick={() => { setNoticiaSeleccionadaId(n.id); openEdit(n); }}
                >
                  <img src={n.imagenUrl} className="w-24 h-24 rounded-[1.5rem] object-cover" />
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800 uppercase text-sm">{n.nombre}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">{n.subnombre}</p>
                    <div className="mt-3 flex gap-4">
                      <span className="text-[8px] bg-slate-100 px-3 py-1 rounded-full font-black text-slate-500 uppercase tracking-tighter">💬 {comentarios.filter(c => c.postId === n.id).length} Ecos</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleEliminar('blog', n.id); }} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* COMENTARIOS FILTRADOS (Derecha) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-end px-4">
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {noticiaSeleccionadaId ? 'Ecos de esta Crónica' : 'Todos los Ecos (Buzón Global)'}
               </h2>
               {noticiaSeleccionadaId && (
                 <button onClick={() => setNoticiaSeleccionadaId(null)} className="text-[8px] font-black text-blue-600 underline uppercase">Ver Todos</button>
               )}
            </div>

            {comentariosFiltrados.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
                 <p className="text-slate-300 font-bold text-xs uppercase italic">El silencio domina este registro...</p>
              </div>
            ) : (
              comentariosFiltrados.map((c) => {
                const n = noticias.find(not => not.id === c.postId);
                return (
                  <div key={c.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-right-5 duration-300">
                    <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black text-slate-900 uppercase">{c.usuario}</span>
                         <span className="text-[8px] text-blue-600 font-bold uppercase mt-1">Crónica: {n?.nombre || 'Desconocida'}</span>
                      </div>
                      <button onClick={() => handleEliminar('comentarios', c.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-500 hover:text-white transition-all text-xs">✕</button>
                    </div>
                    <div className="p-8 space-y-6">
                      <p className="text-slate-600 italic text-sm leading-relaxed font-light">"{c.mensaje}"</p>
                      
                      <div className="space-y-3">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Respuesta del Autor</label>
                        <textarea 
                          className={`${inputStyle} h-28 text-xs bg-slate-100 border-none focus:bg-white`}
                          placeholder="Dicta tu respuesta aquí..."
                          onChange={(e) => setRespuestaTexto({...respuestaTexto, [c.id]: e.target.value})}
                          defaultValue={c.respuesta || ""}
                        />
                      </div>

                      <div className="flex gap-2">
                        {c.estado === 'pendiente' && (
                          <button onClick={() => handleAprobar(c.id)} className="flex-1 py-3 bg-emerald-500 text-white rounded-2xl text-[9px] font-black uppercase shadow-lg shadow-emerald-100">Aprobar</button>
                        )}
                        <button onClick={() => handleResponder(c.id)} className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase hover:bg-blue-600 transition shadow-lg shadow-slate-200">
                          {c.respuesta ? 'Actualizar Respuesta' : 'Enviar Respuesta'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
}