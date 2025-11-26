import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/assets/ayuntamiento_m30/212166-7899870-trafico-calle30-camaras.xml');
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
    
    const result = parser.parse(xmlData);
    
    const camerasList = result.camaras.camara;
    const cameras = (Array.isArray(camerasList) ? camerasList : [camerasList]).map((cam: any) => ({
      id: cam.id,
      name: cam.nombre,
      description: cam.descripcion || '',
      latitude: parseFloat(cam.latitud),
      longitude: parseFloat(cam.longitud),
      imageUrl: cam.imagen || '',
      source: 'm30',
      type: 'camera'
    }));
    
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error parsing M30 XML:', error);
    return NextResponse.json({ error: 'Error parsing M30 XML file' }, { status: 500 });
  }
}
