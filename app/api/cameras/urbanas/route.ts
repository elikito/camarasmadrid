import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/assets/ayuntamiento_urbanas/202088-0-trafico-camaras.kml');
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
    
    const result = parser.parse(xmlData);
    
    const placemarks = result.kml.Document.Placemark;
    const cameras = (Array.isArray(placemarks) ? placemarks : [placemarks]).map((placemark: any) => {
      const coords = placemark.Point.coordinates.split(',');
      
      // Extraer URL de imagen desde la descripción
      let imageUrl = '';
      let nombre = '';
      let numero = '';
      
      if (placemark.description) {
        // La descripción contiene HTML escapado con la URL de la imagen
        // Formato: <img src=https://informo.madrid.es/cameras/CamaraXXXXX.jpg?v=XXXX
        const imgMatch = placemark.description.match(/src=([^\s]+\.jpg[^\s]*)/i);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }
      
      // Extraer datos extendidos
      if (placemark.ExtendedData && placemark.ExtendedData.Data) {
        const dataArray = Array.isArray(placemark.ExtendedData.Data) 
          ? placemark.ExtendedData.Data 
          : [placemark.ExtendedData.Data];
        
        dataArray.forEach((data: any) => {
          if (data['@_name'] === 'Numero') numero = data.Value;
          if (data['@_name'] === 'Nombre') nombre = data.Value;
        });
      }
      
      return {
        id: numero || `cam_urb_${Math.random().toString(36).substr(2, 9)}`,
        name: nombre || placemark.name || 'Cámara urbana',
        description: nombre || placemark.name || '',
        latitude: parseFloat(coords[1]),
        longitude: parseFloat(coords[0]),
        imageUrl: imageUrl,
        source: 'urbanas',
        type: 'camera'
      };
    });
    
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error parsing KML:', error);
    return NextResponse.json({ error: 'Error parsing KML file' }, { status: 500 });
  }
}
