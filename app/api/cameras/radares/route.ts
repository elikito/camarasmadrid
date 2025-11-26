import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/assets/ayuntamiento_radares/RADARES FIJOS_vDTT.csv');
    const csvData = fs.readFileSync(filePath, 'utf-8');
    
    const lines = csvData.split('\n').filter(line => line.trim());
    
    const radars = lines.slice(1).map((line, index) => {
      const values = line.split(';');
      
      // Usar Longitud y Latitud (columnas 12 y 13)
      const longitud = parseFloat(values[12]);
      const latitud = parseFloat(values[13]);
      
      // Si no hay coordenadas en esas columnas, intentar con X/Y WGS84 (columnas 10 y 11)
      const finalLongitud = !isNaN(longitud) ? longitud : parseFloat(values[10]);
      const finalLatitud = !isNaN(latitud) ? latitud : parseFloat(values[11]);
      
      return {
        id: values[0] || `radar_${index}`,
        name: values[1] || 'Radar',
        description: `${values[6]} - ${values[2]} - Velocidad máx: ${values[14]} km/h`,
        latitude: finalLatitud,
        longitude: finalLongitud,
        imageUrl: '',
        source: 'radares',
        type: 'radar',
        radarType: values[6], // Tipo
        maxSpeed: values[14], // Velocidad límite
        ubicacion: values[1],
        carretera: values[2],
        sentido: values[5]
      };
    }).filter(radar => !isNaN(radar.latitude) && !isNaN(radar.longitude));
    
    return NextResponse.json(radars);
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return NextResponse.json({ error: 'Error parsing CSV file' }, { status: 500 });
  }
}
