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
    
    const camerasList = result.Camaras.Camara;
    const cameras = (Array.isArray(camerasList) ? camerasList : [camerasList]).map((cam: any) => {
      const imageUrl = cam.URL ? `https://${cam.URL}` : '';
      
      return {
        id: cam.Nombre || `cam_m30_${Math.random().toString(36).substr(2, 9)}`,
        name: cam.Nombre || 'Cámara M-30',
        description: cam.Fichero ? cam.Fichero.replace('.jpg', '') : '',
        latitude: parseFloat(cam.Posicion.Latitud),
        longitude: parseFloat(cam.Posicion.Longitud),
        imageUrl: imageUrl,
        source: 'm30',
        type: 'camera'
      };
    });
    
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error parsing M30 XML:', error);
    return NextResponse.json({ error: 'Error parsing M30 XML file' }, { status: 500 });
  }
}
