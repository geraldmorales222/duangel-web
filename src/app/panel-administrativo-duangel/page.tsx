'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import Link from 'next/link';
import { getAdminEmails } from '@/lib/constants';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  const [categoriaPrincipal, setCategoriaPrincipal] = useState('');
  const [subCategoriaEmeria, setSubCategoriaEmeria] = useState('');

  // Formulario universal para toda la Saga Duangel
  const [formData, setFormData] = useState({
    nombre: '', apodo: '', linaje: '', sangre: '',
    descripcion: '', habilidades: '', biografia: '',
    origen: '', habitat: '', historia: '', 
    genero: '', texto: '', comentario: '' 
  });
  const [imagen, setImagen] = useState<File | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      nombre: '', apodo: '', linaje: '', sangre: '',
      descripcion: '', habilidades: '', biografia: '',
      origen: '', habitat: '', historia: '',
      genero: '', texto: '', comentario: ''
    });
    setImagen(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen) return alert("Por favor selecciona una imagen");
    
    setSubiendo(true);
    
    try {
      // 1. SUBIDA A CLOUDINARY
      const dataImagen = new FormData();
      dataImagen.append("file", imagen);
      dataImagen.append("upload_preset", "emeria_preset");

      const resCloudinary = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: dataImagen }
      );
      const dataCloud = await resCloudinary.json();
      const urlCloudinary = dataCloud.secure_url;

      // 2. GENERAR RUTA DE RESPALDO DINÁMICA
      const nombreLimpio = formData.nombre.toLowerCase().replace(/\s+/g, '-');
      let rutaLocalRespaldo = "";
      if (categoriaPrincipal === 'mundo_emeria') {
        rutaLocalRespaldo = `/images/mundoEmeria/${subCategoriaEmeria}/${nombreLimpio}.jpg`;
      } else {
        rutaLocalRespaldo = `/images/${categoriaPrincipal}/${nombreLimpio}.jpg`;
      }

      // 3. DETERMINAR DATOS SEGÚN CATEGORÍA
      let coleccionFinal = categoriaPrincipal;
      let dataToSave: any = { 
        nombre: formData.nombre, 
        imagenUrl: urlCloudinary,
        rutaLocal: rutaLocalRespaldo,
        fecha: new Date(),
        autor: "Roger Morales"
      };

      if (categoriaPrincipal === 'mundo_emeria') {
        coleccionFinal = `lore_${subCategoriaEmeria}`;
        if (subCategoriaEmeria === 'personajes') {
          dataToSave = { ...dataToSave, apodo: formData.apodo, linaje: formData.linaje, sangre: formData.sangre, descripcion: formData.descripcion, habilidades: formData.habilidades, biografia: formData.biografia };
        } else if (subCategoriaEmeria === 'criaturas') {
          dataToSave = { ...dataToSave, origen: formData.origen, habitat: formData.habitat, habilidades: formData.habilidades, descripcion: formData.descripcion };
        } else {
          // Reinos y Lugares
          dataToSave = { ...dataToSave, descripcion: formData.descripcion, historia: formData.historia };
        }
      } else if (categoriaPrincipal === 'historias') {
        dataToSave = { ...dataToSave, genero: formData.genero, texto: formData.texto, comentario: formData.comentario };
      } else if (categoriaPrincipal === 'arte_conceptual') {
        dataToSave = { ...dataToSave, texto: formData.texto, comentario: formData.comentario };
      }

      // 4. GUARDAR EN FIRESTORE
      await addDoc(collection(db, coleccionFinal), dataToSave);
      
      alert(`¡Publicado exitosamente en ${coleccionFinal}!\nRecuerda guardar la imagen en: ${rutaLocalRespaldo}`);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Error crítico en el proceso de guardado.");
    } finally {
      setSubiendo(false);
    }
  };

  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white font-mono uppercase tracking-widest">Sincronizando con Emeria...</div>;

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

  const inputStyle = "w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none font-medium bg-white text-slate-900 placeholder:text-slate-400 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto pt-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div className="text-center md:text-left text-slate-800">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Duangel Panel</h1>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Gestión de Contenido</p>
          </div>
          <button onClick={() => signOut(auth)} className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all border border-red-100">CERRAR SESIÓN</button>
          <Link href="/admin-bd">
            <button className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm">
              Editar Registros
            </button>
          </Link>
          <Link href="/admin-blog">
            <button className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm">
              GESTIONAR BLOG
            </button>
          </Link>
          <Link href="/mensajes-contacto">
            <button className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm">
              Mensajes de seguidores
            </button>
          </Link>
        </header>

        <form onSubmit={handleGuardar} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-6 text-center text-white font-bold tracking-[0.4em] text-xs uppercase">Nuevo Registro</div>

          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">1. Sección de la Web</label>
              <select required className="w-full p-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-900 font-bold focus:border-blue-500 outline-none" value={categoriaPrincipal} onChange={(e) => { setCategoriaPrincipal(e.target.value); setSubCategoriaEmeria(''); resetForm(); }}>
                <option value="">Seleccionar...</option>
                <option value="mundo_emeria">Mundo Emeria (Lore)</option>
                <option value="historias">Historias Cortas</option>
                <option value="arte_conceptual">Arte Conceptual</option>
              </select>
            </div>

            {categoriaPrincipal === 'mundo_emeria' && (
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                <label className="text-xs font-black text-blue-500 uppercase tracking-widest ml-1">2. Clasificación</label>
                <select required className="w-full p-4 border-2 border-blue-200 rounded-2xl bg-blue-50 text-blue-900 font-bold focus:border-blue-500 outline-none" value={subCategoriaEmeria} onChange={(e) => { setSubCategoriaEmeria(e.target.value); resetForm(); }}>
                  <option value="">¿Qué deseas crear?</option>
                  <option value="personajes">Personajes</option>
                  <option value="criaturas">Criaturas</option>
                  <option value="reinos">Reinos</option>
                  <option value="lugares">Lugares</option>
                </select>
              </div>
            )}

            {(categoriaPrincipal && (categoriaPrincipal !== 'mundo_emeria' || subCategoriaEmeria)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 animate-in fade-in duration-500">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Título / Nombre</label>
                  <input name="nombre" value={formData.nombre} onChange={handleInputChange} required className={inputStyle} />
                </div>

                {/* DINÁMICO POR CATEGORÍA */}
                {categoriaPrincipal === 'historias' && (
                  <>
                    <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Género</label><input name="genero" value={formData.genero} onChange={handleInputChange} className={inputStyle} /></div>
                    <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Relato Completo</label><textarea name="texto" value={formData.texto} onChange={handleInputChange} className={`${inputStyle} h-64`} /></div>
                  </>
                )}

                {categoriaPrincipal === 'arte_conceptual' && (
                  <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Descripción de la Obra</label><textarea name="texto" value={formData.texto} onChange={handleInputChange} className={`${inputStyle} h-32`} /></div>
                )}

                {subCategoriaEmeria === 'personajes' && (
                  <>
                    <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Apodo</label><input name="apodo" value={formData.apodo} onChange={handleInputChange} className={inputStyle} /></div>
                    <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Linaje</label><input name="linaje" value={formData.linaje} onChange={handleInputChange} className={inputStyle} /></div>
                    <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Sangre</label><input name="sangre" value={formData.sangre} onChange={handleInputChange} className={inputStyle} /></div>
                    <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Habilidades</label><input name="habilidades" value={formData.habilidades} onChange={handleInputChange} className={inputStyle} /></div>
                    <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Biografía</label><textarea name="biografia" value={formData.biografia} onChange={handleInputChange} className={`${inputStyle} h-40`} /></div>
                  </>
                )}

                {subCategoriaEmeria === 'criaturas' && (
                  <>
                    <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Origen</label><input name="origen" value={formData.origen} onChange={handleInputChange} className={inputStyle} /></div>
                    <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Hábitat</label><input name="habitat" value={formData.habitat} onChange={handleInputChange} className={inputStyle} /></div>
                    <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Capacidades</label><input name="habilidades" value={formData.habilidades} onChange={handleInputChange} className={inputStyle} /></div>
                    <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Descripción de Especie</label><textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} className={`${inputStyle} h-32`} /></div>
                  </>
                )}

                {(subCategoriaEmeria === 'reinos' || subCategoriaEmeria === 'lugares') && (
                  <>
                    <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Descripción General</label><textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} className={`${inputStyle} h-24`} /></div>
                    <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Historia Detallada</label><textarea name="historia" value={formData.historia} onChange={handleInputChange} className={`${inputStyle} h-40`} /></div>
                  </>
                )}

                {/* COMENTARIO PARA HISTORIAS Y ARTE */}
                {(categoriaPrincipal === 'historias' || categoriaPrincipal === 'arte_conceptual') && (
                   <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase">Comentario del Autor</label><textarea name="comentario" value={formData.comentario} onChange={handleInputChange} className={`${inputStyle} h-24`} /></div>
                )}

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Imagen</label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <p className="text-sm font-bold text-slate-600">{imagen ? `📄 ${imagen.name}` : "Subir archivo"}</p>
                  </div>
                </div>

                <button disabled={subiendo} type="submit" className="md:col-span-2 w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all active:scale-[0.98] disabled:bg-slate-300">
                  {subiendo ? 'PUBLICANDO...' : 'GUARDAR REGISTRO'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}