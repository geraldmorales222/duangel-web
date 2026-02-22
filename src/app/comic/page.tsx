// Galeria de Comics e Historias Visuales
export default function ComicPage() {
  return (
    <div className="min-h-screen p-10 md:p-24 bg-black text-center">
      <h1 className="text-5xl font-cinzel text-[#f2c005] mb-8">Los Spin-off de Emeria</h1>
      <div className="bg-stone-medieval max-w-2xl mx-auto p-12 rounded-xl border border-[#f2c005]/20">
        <div className="w-20 h-20 mx-auto mb-6 opacity-20 bg-[#f2c005] rounded-full blur-2xl animate-pulse"></div>
        <p className="font-cinzel text-gray-300 tracking-[0.3em]">Próximamente: Sistema de Moneda Virtual Duangel</p>
        <p className="text-gray-500 text-xs mt-4">Accede a contenido exclusivo y arte secuencial inédito.</p>
      </div>
    </div>
  );
}