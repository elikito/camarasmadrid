import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Llamar a todas las APIs internas para consolidar los datos
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const [urbanasRes, m30Res, radaresRes] = await Promise.all([
      fetch(`${baseUrl}/api/cameras/urbanas`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/cameras/m30`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/cameras/radares`, { cache: 'no-store' })
    ]);
    
    const urbanas = await urbanasRes.json();
    const m30 = await m30Res.json();
    const radares = await radaresRes.json();
    
    const allCameras = [
      ...(Array.isArray(urbanas) ? urbanas : []),
      ...(Array.isArray(m30) ? m30 : []),
      ...(Array.isArray(radares) ? radares : [])
    ];
    
    return NextResponse.json(allCameras);
  } catch (error) {
    console.error('Error fetching all cameras:', error);
    return NextResponse.json({ error: 'Error fetching cameras data' }, { status: 500 });
  }
}
