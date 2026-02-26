import { MetadataRoute } from 'next';

/**
 * Genera el Sitemap oficial de la Saga Duangel.
 * Este archivo es detectado automáticamente por Next.js para habilitar
 * la indexación en buscadores como Google o Bing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL del proyecto desplegado en Vercel con dominio .cl
  const baseUrl = "https://duangelelcaidodeloscielos.cl";

  // 1. Rutas Estáticas Principales
  // Prioridad 1.0 para la Home y secciones principales
  const staticRoutes = [
    "",                // Home
    "/mundo-emeria",
    "/libros",   // Lore Principal
    "/historias",
    "/blog",
    "/roger",
    "/arte-conceptual",
    "/comic",
    "/contacto",       // Formulario de contacto
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const, // Actualización semanal
    priority: route === "" ? 1.0 : 0.9,
  }));

  // 2. Rutas de Categorías de Lore
  // Google indexará directamente las pestañas del Mundo de Emeria
  const categories = ['personajes', 'criaturas', 'reinos', 'lugares'];
  
  const loreRoutes = categories.map((tab) => ({
    url: `${baseUrl}/mundo-emeria?tab=${tab}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Unificamos todas las rutas en el sitemap final
  return [...staticRoutes, ...loreRoutes];
}