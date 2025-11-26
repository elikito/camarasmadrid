import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

export async function GET() {
  try {
    // Parsear directamente los archivos en lugar de hacer fetch interno
    const cameras = [];
    
    // 1. Parsear cámaras urbanas (KML)
    try {
      const kmlPath = path.join(process.cwd(), 'public/assets/ayuntamiento_urbanas/202088-0-trafico-camaras.kml');
      const kmlData = fs.readFileSync(kmlPath, 'utf-8');
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
      const result = parser.parse(kmlData);
      
      const placemarks = result.kml.Document.Placemark;
      const urbanas = (Array.isArray(placemarks) ? placemarks : [placemarks]).map((placemark: any) => {
        const coords = placemark.Point.coordinates.split(',');
        let imageUrl = '';
        let nombre = '';
        let numero = '';
        
        if (placemark.description) {
          const imgMatch = placemark.description.match(/src=([^\s]+\.jpg[^\s]*)/i);
          if (imgMatch) imageUrl = imgMatch[1];
        }
        
        if (placemark.ExtendedData && placemark.ExtendedData.Data) {
          const dataArray = Array.isArray(placemark.ExtendedData.Data) ? placemark.ExtendedData.Data : [placemark.ExtendedData.Data];
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
      cameras.push(...urbanas);
    } catch (error) {
      console.error('Error parsing urbanas:', error);
    }
    
    // 2. Parsear cámaras M-30 (XML)
    try {
      const xmlPath = path.join(process.cwd(), 'public/assets/ayuntamiento_m30/212166-7899870-trafico-calle30-camaras.xml');
      const xmlData = fs.readFileSync(xmlPath, 'utf-8');
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
      const result = parser.parse(xmlData);
      
      const camerasList = result.camaras.camara;
      const m30 = (Array.isArray(camerasList) ? camerasList : [camerasList]).map((cam: any) => ({
        id: cam.id,
        name: cam.nombre,
        description: cam.descripcion || '',
        latitude: parseFloat(cam.latitud),
        longitude: parseFloat(cam.longitud),
        imageUrl: cam.imagen || '',
        source: 'm30',
        type: 'camera'
      }));
      cameras.push(...m30);
    } catch (error) {
      console.error('Error parsing M30:', error);
    }
    
    // 3. Parsear radares (CSV)
    try {
      const csvPath = path.join(process.cwd(), 'public/assets/ayuntamiento_radares/300049-0-radares-fijos-moviles.csv');
      const csvData = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvData.split('\n').filter(line => line.trim());
      
      const radares = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        return {
          id: values[0] || `radar_${index}`,
          name: values[2] || 'Radar',
          description: `${values[1]} - Velocidad máx: ${values[5]} km/h`,
          latitude: parseFloat(values[3]),
          longitude: parseFloat(values[4]),
          imageUrl: '',
          source: 'radares',
          type: 'radar',
          radarType: values[1],
          maxSpeed: values[5]
        };
      });
      cameras.push(...radares);
    } catch (error) {
      console.error('Error parsing radares:', error);
    }
    
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error fetching all cameras:', error);
    return NextResponse.json({ error: 'Error fetching cameras data' }, { status: 500 });
  }
}
