import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/assets/dgt/camaras_datex2_v36.xml');
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
    
    const result = parser.parse(xmlData);
    
    // Navegar por la estructura DATEX II
    const devices = result['d2:payload']['ns2:device'];
    const deviceArray = Array.isArray(devices) ? devices : [devices];
    
    // Filtrar solo cámaras en la Comunidad de Madrid (aproximadamente entre lat 39.5-41.2, lon -4.5 a -3.0)
    const cameras = deviceArray
      .filter((device: any) => {
        if (device['ns2:typeOfDevice'] !== 'camera') return false;
        
        const lat = parseFloat(device['ns2:pointLocation']?.['loc:tpegPointLocation']?.['loc:point']?.['loc:pointCoordinates']?.['loc:latitude']);
        const lon = parseFloat(device['ns2:pointLocation']?.['loc:tpegPointLocation']?.['loc:point']?.['loc:pointCoordinates']?.['loc:longitude']);
        
        // Filtrar por área de Madrid
        return lat >= 39.5 && lat <= 41.2 && lon >= -4.5 && lon <= -3.0;
      })
      .map((device: any) => {
        const id = device['@_id'];
        const pointLocation = device['ns2:pointLocation'];
        const roadInfo = pointLocation?.['loc:supplementaryPositionalDescription']?.['loc:roadInformation'];
        const coordinates = pointLocation?.['loc:tpegPointLocation']?.['loc:point']?.['loc:pointCoordinates'];
        const extension = pointLocation?.['loc:tpegPointLocation']?.['loc:point']?.['loc:_tpegNonJunctionPointExtension']?.['loc:extendedTpegNonJunctionPoint'];
        const imageUrl = device['fse:deviceUrl'];
        
        const roadName = roadInfo?.['loc:roadName'] || '';
        const roadDestination = roadInfo?.['loc:roadDestination'] || '';
        const km = extension?.['lse:kilometerPoint'] || '';
        const province = extension?.['lse:province'] || '';
        
        return {
          id: `dgt_${id}`,
          name: `${roadName} ${km ? `PK ${km}` : ''}`.trim() || `Cámara DGT ${id}`,
          description: `${roadName} dirección ${roadDestination} - ${province}`,
          latitude: parseFloat(coordinates?.['loc:latitude']),
          longitude: parseFloat(coordinates?.['loc:longitude']),
          imageUrl: imageUrl || '',
          source: 'dgt',
          type: 'camera',
          roadName: roadName,
          roadDestination: roadDestination,
          kilometerPoint: km,
          province: province
        };
      });
    
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error parsing DGT XML:', error);
    return NextResponse.json({ error: 'Error parsing DGT XML file' }, { status: 500 });
  }
}
