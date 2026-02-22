'use client';

import { useState, useEffect, Suspense } from 'react'; // Importamos Suspense
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

// 1. CREAMOS UN COMPONENTE INTERNO PARA LA LÓGICA DEL NAVBAR
function NavbarContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showEmeriaMenu, setShowEmeriaMenu] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (error) { console.error("Error al entrar a Emeria:", error); }
  };

  const logout = () => signOut(auth);

  const isSubLinkActive = (href: string) => {
    if (href.includes('?')) {
      const [path, query] = href.split('?');
      const tabValue = query.split('=')[1];
      return pathname === path && searchParams.get('tab') === tabValue;
    }
    return pathname === href && !searchParams.get('tab');
  };

  const emeriaSubLinks = [
    { name: 'Mapa Interactivo', href: '/mundo-emeria' },
    { name: 'Personajes', href: '/mundo-emeria?tab=personajes' },
    { name: 'Criaturas', href: '/mundo-emeria?tab=criaturas' },
    { name: 'Reinos', href: '/mundo-emeria?tab=reinos' },
    { name: 'Lugares', href: '/mundo-emeria?tab=lugares' },
  ];

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Libros', href: '/libros' },
    { name: 'Historias', href: '/historias' },
    { name: 'Arte', href: '/arte-conceptual' },
    { name: 'Blog', href: '/blog' },
    { name: 'Comic', href: '/comic' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Roger', href: '/roger' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[150] bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="font-medieval text-2xl text-[#f2c005] tracking-tighter">Duangel</Link>

        {/* --- NAVEGACIÓN PC --- */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/" className={`font-cinzel text-[10px] tracking-[0.2em] uppercase transition-colors ${pathname === '/' ? 'text-[#f2c005]' : 'text-gray-400 hover:text-white'}`}>Inicio</Link>
          
          <div 
            className="relative group"
            onMouseEnter={() => setShowEmeriaMenu(true)}
            onMouseLeave={() => setShowEmeriaMenu(false)}
          >
            <button className={`flex items-center gap-1 font-cinzel text-[10px] tracking-[0.2em] uppercase transition-colors ${pathname.startsWith('/mundo-emeria') ? 'text-[#f2c005]' : 'text-gray-400 hover:text-white'}`}>
              Mundo Emeria 
              <span className={`text-[8px] transition-transform duration-300 ${showEmeriaMenu ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {showEmeriaMenu && (
              <div className="absolute top-full left-0 w-48 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl">
                  {emeriaSubLinks.map((sub) => (
                    <Link 
                      key={sub.href} 
                      href={sub.href}
                      className={`block px-5 py-3 font-cinzel text-[9px] transition-all border-b border-white/5 last:border-0 ${
                        isSubLinkActive(sub.href) 
                        ? 'bg-[#f2c005] text-black font-bold' 
                        : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLinks.filter(l => l.name !== 'Inicio').map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`font-cinzel text-[10px] tracking-[0.2em] uppercase transition-colors ${pathname === link.href ? 'text-[#f2c005]' : 'text-gray-400 hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* --- USUARIO --- */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10">
              <img src={user.photoURL || ''} alt="Avatar" className="w-8 h-8 rounded-full border border-[#f2c005]/50" />
              <div className="hidden md:block text-left">
                <p className="font-cinzel text-[8px] text-gray-500 uppercase tracking-widest leading-none">Viajero</p>
                <p className="font-cinzel text-[9px] text-white uppercase truncate max-w-[80px]">{user.displayName?.split(' ')[0]}</p>
              </div>
              <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors text-[10px] ml-2">✕</button>
            </div>
          ) : (
            <button onClick={login} className="bg-[#f2c005] text-black font-black font-cinzel text-[9px] px-5 py-2.5 rounded-full tracking-widest hover:bg-white transition-all">INICIAR SESIÓN</button>
          )}
          <button className="lg:hidden text-[#f2c005] text-xl" onClick={() => setIsOpen(!isOpen)}>{isOpen ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* --- MÓVIL --- */}
      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-white/10 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link href="/" onClick={() => setIsOpen(false)} className={`block font-cinzel text-xs uppercase tracking-widest ${pathname === '/' ? 'text-[#f2c005]' : 'text-gray-400'}`}>Inicio</Link>
          
          <div className="space-y-2 text-left">
            <button 
              onClick={() => setShowEmeriaMenu(!showEmeriaMenu)}
              className={`flex justify-between items-center w-full font-cinzel text-xs uppercase tracking-widest ${pathname.startsWith('/mundo-emeria') ? 'text-[#f2c005]' : 'text-gray-400'}`}
            >
              Mundo Emeria <span>{showEmeriaMenu ? '−' : '+'}</span>
            </button>
            {showEmeriaMenu && (
              <div className="pl-4 space-y-3 border-l border-[#f2c005]/20 animate-in fade-in duration-300">
                {emeriaSubLinks.map((sub) => (
                  <Link 
                    key={sub.href} 
                    href={sub.href} 
                    onClick={() => { setIsOpen(false); setShowEmeriaMenu(false); }}
                    className={`block font-cinzel text-[10px] uppercase ${isSubLinkActive(sub.href) ? 'text-[#f2c005] font-bold' : 'text-gray-500'}`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.filter(l => l.name !== 'Inicio').map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`block font-cinzel text-xs uppercase tracking-widest ${pathname === link.href ? 'text-[#f2c005]' : 'text-gray-400'}`}>
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

// 2. EXPORTACIÓN PRINCIPAL PROTEGIDA CON SUSPENSE
export default function Navbar() {
  return (
    <Suspense fallback={<div className="fixed top-0 w-full h-20 bg-black border-b border-white/10 z-[150]" />}>
      <NavbarContent />
    </Suspense>
  );
}