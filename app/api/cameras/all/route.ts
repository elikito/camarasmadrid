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
      
      const camerasList = result.Camaras.Camara;
      const m30 = (Array.isArray(camerasList) ? camerasList : [camerasList]).map((cam: any) => {
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
      cameras.push(...m30);
    } catch (error) {
      console.error('Error parsing M30:', error);
    }
    
    // 3. Parsear radares (CSV)
    try {
      const csvPath = path.join(process.cwd(), 'public/assets/ayuntamiento_radares/RADARES FIJOS_vDTT.csv');
      const csvData = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvData.split('\n').filter(line => line.trim());
      
      const radares = lines.slice(1).map((line, index) => {
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
          radarType: values[6],
          maxSpeed: values[14],
          ubicacion: values[1],
          carretera: values[2],
          sentido: values[5]
        };
      }).filter(radar => !isNaN(radar.latitude) && !isNaN(radar.longitude));
      
      cameras.push(...radares);
    } catch (error) {
      console.error('Error parsing radares:', error);
    }
    
    // 4. Parsear cámaras DGT (XML DATEX II)
    try {
      const dgtPath = path.join(process.cwd(), 'public/assets/dgt/camaras_datex2_v36.xml');
      const dgtData = fs.readFileSync(dgtPath, 'utf-8');
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
      const result = parser.parse(dgtData);
      
      const devices = result['d2:payload']['ns2:device'];
      const deviceArray = Array.isArray(devices) ? devices : [devices];
      
      const dgt = deviceArray
        .filter((device: any) => {
          if (device['ns2:typeOfDevice'] !== 'camera') return false;
          const lat = parseFloat(device['ns2:pointLocation']?.['loc:tpegPointLocation']?.['loc:point']?.['loc:pointCoordinates']?.['loc:latitude']);
          const lon = parseFloat(device['ns2:pointLocation']?.['loc:tpegPointLocation']?.['loc:point']?.['loc:pointCoordinates']?.['loc:longitude']);
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
            type: 'camera'
          };
        });
      
      cameras.push(...dgt);
    } catch (error) {
      console.error('Error parsing DGT:', error);
    }
    
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error fetching all cameras:', error);
    return NextResponse.json({ error: 'Error fetching cameras data' }, { status: 500 });
  }
}
