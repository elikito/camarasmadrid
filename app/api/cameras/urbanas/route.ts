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
      
      // Extraer datos extendidos
      let url = '';
      let id = '';
      
      if (placemark.ExtendedData && placemark.ExtendedData.Data) {
        const dataArray = Array.isArray(placemark.ExtendedData.Data) 
          ? placemark.ExtendedData.Data 
          : [placemark.ExtendedData.Data];
        
        dataArray.forEach((data: any) => {
          if (data['@_name'] === 'url') url = data.value;
          if (data['@_name'] === 'id') id = data.value;
        });
      }
      
      return {
        id: id || `cam_urb_${Math.random().toString(36).substr(2, 9)}`,
        name: placemark.name,
        description: placemark.description || '',
        latitude: parseFloat(coords[1]),
        longitude: parseFloat(coords[0]),
        imageUrl: url || '',
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
