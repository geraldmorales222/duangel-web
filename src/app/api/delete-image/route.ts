import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configuración de Servidor
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    // Ejecuta la destrucción en el servidor de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error en servidor Cloudinary:", error);
    return NextResponse.json({ error: "Fallo en la eliminación" }, { status: 500 });
  }
}