import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/assets/ayuntamiento_radares/300049-0-radares-fijos-moviles.csv');
    const csvData = fs.readFileSync(filePath, 'utf-8');
    
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    const radars = lines.slice(1).map((line, index) => {
      const values = line.split(',');
      
      return {
        id: values[0] || `radar_${index}`,
        name: values[2] || 'Radar',
        description: `${values[1]} - Velocidad máx: ${values[5]} km/h`,
        latitude: parseFloat(values[3]),
        longitude: parseFloat(values[4]),
        imageUrl: '', // Los radares generalmente no tienen imagen en vivo
        source: 'radares',
        type: 'radar',
        radarType: values[1], // fijo o movil
        maxSpeed: values[5]
      };
    });
    
    return NextResponse.json(radars);
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return NextResponse.json({ error: 'Error parsing CSV file' }, { status: 500 });
  }
}
