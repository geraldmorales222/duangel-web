'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth, googleProvider } from '@/lib/firebase';
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, 
  query, orderBy 
} from 'firebase/firestore';
import {signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';
import { getAdminEmails } from '@/lib/constants';

export default function AdminBDPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  // Estados de navegación interna
  const [categoria, setCategoria] = useState('');
  const [subCategoria, setSubCategoria] = useState('');
  const [registros, setRegistros] = useState<any[]>([]);
  const [editando, setEditando] = useState<any | null>(null);

  // Estados para cambio de imagen
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


// 1. Seguridad y Autenticación
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    // Solo actualizamos el estado del usuario, la validación la hacemos abajo en el return
    setUser(currentUser);
    setLoading(false);
  });
  return () => unsubscribe();
}, []);

  // 2. Carga dinámica de datos
  useEffect(() => {
    if (categoria) {
      fetchRegistros();
      setEditando(null);
      setNuevaImagen(null);
      setPreviewUrl(null);
    }
  }, [categoria, subCategoria]);

  const fetchRegistros = async () => {
    let coleccionFinal = categoria;
    if (categoria === 'mundo_emeria') {
      if (!subCategoria) return setRegistros([]);
      coleccionFinal = `lore_${subCategoria}`;
    }

    try {
      const q = query(collection(db, coleccionFinal), orderBy("nombre", "asc"));
      const snap = await getDocs(q);
      setRegistros(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setRegistros([]);
    }
  };

  // 3. Funciones de Cloudinary (Subir y Borrar)
  const subirImagenCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "emeria_preset");
    
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );
    const cloudData = await res.json();
    return cloudData.secure_url;
  };

  const borrarImagenCloudinary = async (url: string) => {
    try {
      const urlParts = url.split('/');
      const publicId = urlParts[urlParts.length - 1].split('.')[0];
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });
    } catch (e) {
      console.error("Error al borrar imagen antigua:", e);
    }
  };

  // 4. Acciones de Base de Datos
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);
    let coleccionFinal = categoria;
    if (categoria === 'mundo_emeria') coleccionFinal = `lore_${subCategoria}`;

    try {
      let dataActualizada = { ...editando };

      // Si hay una imagen nueva seleccionada
      if (nuevaImagen) {
        // Borrar la vieja primero para no acumular basura
        if (editando.imagenUrl) await borrarImagenCloudinary(editando.imagenUrl);
        // Subir la nueva
        const nuevaUrl = await subirImagenCloudinary(nuevaImagen);
        dataActualizada.imagenUrl = nuevaUrl;
      }

      const docRef = doc(db, coleccionFinal, editando.id);
      await updateDoc(docRef, dataActualizada);
      
      alert("Registro actualizado correctamente.");
      setEditando(null);
      setNuevaImagen(null);
      setPreviewUrl(null);
      fetchRegistros();
    } catch (e) {
      alert("Error al actualizar el registro.");
    } finally {
      setProcesando(false);
    }
  };

  const handleDelete = async (reg: any) => {
    if (confirm(`¿Estás seguro de borrar a "${reg.nombre}"? Esto eliminará también su imagen de la nube.`)) {
      setProcesando(true);
      let coleccionFinal = categoria;
      if (categoria === 'mundo_emeria') coleccionFinal = `lore_${subCategoria}`;

      try {
        // Borrar imagen en Cloudinary
        if (reg.imagenUrl) await borrarImagenCloudinary(reg.imagenUrl);
        // Borrar documento en Firebase
        await deleteDoc(doc(db, coleccionFinal, reg.id));
        
        fetchRegistros();
        setEditando(null);
      } catch (e) {
        alert("Error en el proceso de eliminación.");
      } finally {
        setProcesando(false);
      }
    }
  };

  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white font-mono uppercase tracking-widest">Sincronizando Archivos...</div>;

  if (!user || !getAdminEmails().includes(user.email || '')) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-lg shadow-2xl">
          <h1 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Acceso Restringido</h1>
          <button onClick={() => signInWithPopup(auth, googleProvider)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">Identificarse</button>
        </div>
      </div>
    );
  }  
  const inputStyle = "w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500 text-sm font-medium transition-all";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Base de Datos Maestro</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em]">Gestión de Lore y Contenido</p>
          </div>
          <Link href="/panel-administrativo-duangel">
            <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] hover:bg-blue-700 transition-all uppercase shadow-lg">← Panel Principal</button>
          </Link>
        </header>

        {/* SELECTORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <select className={inputStyle} value={categoria} onChange={(e) => { setCategoria(e.target.value); setSubCategoria(''); }}>
            <option value="">Elegir área...</option>
            <option value="mundo_emeria">Mundo Emeria (Lore)</option>
            <option value="historias">Historias Cortas</option>
            <option value="arte_conceptual">Arte Conceptual</option>
          </select>

          {categoria === 'mundo_emeria' && (
            <select className={`${inputStyle} border-blue-100 bg-blue-50/30`} value={subCategoria} onChange={(e) => setSubCategoria(e.target.value)}>
              <option value="">¿Qué deseas editar?</option>
              <option value="personajes">Personajes</option>
              <option value="criaturas">Criaturas</option>
              <option value="reinos">Reinos</option>
              <option value="lugares">Lugares</option>
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LISTADO */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Registros ({registros.length})</h2>
            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {registros.map((reg) => (
                <div 
                  key={reg.id} 
                  className={`bg-white p-4 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center gap-4 ${editando?.id === reg.id ? 'border-blue-500 shadow-md' : 'border-transparent shadow-sm hover:border-slate-200'}`}
                  onClick={() => { setEditando(reg); setNuevaImagen(null); setPreviewUrl(null); }}
                >
                  <img src={reg.imagenUrl} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-black text-slate-800 uppercase text-xs truncate">{reg.nombre}</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{reg.linaje || reg.genero || 'Lore'}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(reg); }} className="text-red-300 hover:text-red-500 text-xs p-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* EDITOR */}
          <div className="lg:col-span-7">
            {editando ? (
              <form onSubmit={handleUpdate} className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-slate-200 space-y-6">
                
                {/* Gestor de Imagen */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="relative group">
                    <img src={previewUrl || editando.imagenUrl} className="w-32 h-32 rounded-3xl object-cover shadow-xl border-4 border-white" />
                    {previewUrl && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] px-2 py-1 rounded-full font-black uppercase">Nueva</span>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Cambiar Imagen</label>
                    <input type="file" className="text-xs" onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setNuevaImagen(file);
                      if (file) setPreviewUrl(URL.createObjectURL(file));
                    }} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Nombre</label>
                    <input className={inputStyle} value={editando.nombre} onChange={e => setEditando({...editando, nombre: e.target.value})} />
                  </div>

                  {subCategoria === 'personajes' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Linaje</label><input className={inputStyle} value={editando.linaje} onChange={e => setEditando({...editando, linaje: e.target.value})} /></div>
                      <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Sangre</label><input className={inputStyle} value={editando.sangre} onChange={e => setEditando({...editando, sangre: e.target.value})} /></div>
                      <div className="col-span-2 space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Biografía</label><textarea className={`${inputStyle} h-40`} value={editando.biografia} onChange={e => setEditando({...editando, biografia: e.target.value})} /></div>
                    </div>
                  )}

                  {(categoria === 'arte_conceptual' || categoria === 'historias') && (
                    <div className="space-y-4">
                      <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Relato</label><textarea className={`${inputStyle} h-48`} value={editando.texto} onChange={e => setEditando({...editando, texto: e.target.value})} /></div>
                      <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Comentario</label><textarea className={`${inputStyle} h-24`} value={editando.comentario} onChange={e => setEditando({...editando, comentario: e.target.value})} /></div>
                    </div>
                  )}

                  {(subCategoria === 'reinos' || subCategoria === 'lugares') && (
                    <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Historia</label><textarea className={`${inputStyle} h-64`} value={editando.historia} onChange={e => setEditando({...editando, historia: e.target.value})} /></div>
                  )}
                </div>

                <button disabled={procesando} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-slate-900 transition-all shadow-xl">
                  {procesando ? 'Procesando en la Nube...' : 'Guardar Cambios'}
                </button>
              </form>
            ) : (
              <div className="h-96 border-2 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-[0.3em] text-center p-10">
                Selecciona un registro para editar su historia
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}