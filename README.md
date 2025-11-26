# Cámaras Madrid 📹

Aplicación web fullstack para visualizar cámaras de tráfico y radares de Madrid en un mapa interactivo.

## 🚀 Características

- ✅ Mapa interactivo con Leaflet centrado en Madrid
- ✅ Visualización de cámaras urbanas, cámaras M-30 y radares
- ✅ Filtros por tipo de fuente (urbanas, M-30, radares)
- ✅ Modal con imagen de cámara y vista de pantalla completa
- ✅ Listado completo con búsqueda y ordenación
- ✅ Modo oscuro con persistencia
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Menú hamburguesa en móvil
- ✅ API Routes para parsear KML, XML y CSV

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos utility-first
- **Leaflet** - Librería de mapas interactivos
- **React-Leaflet** - Componentes React para Leaflet
- **fast-xml-parser** - Parser XML para archivos de cámaras

## 📁 Estructura del proyecto

```
camarasmadrid/
├── app/
│   ├── api/
│   │   └── cameras/
│   │       ├── all/route.ts         # Endpoint consolidado
│   │       ├── urbanas/route.ts     # Parser KML
│   │       ├── m30/route.ts         # Parser XML
│   │       └── radares/route.ts     # Parser CSV
│   ├── globals.css                   # Estilos globales
│   ├── layout.tsx                    # Layout principal
│   └── page.tsx                      # Página principal
├── components/
│   ├── MapComponent.tsx              # Mapa con Leaflet
│   ├── ImageModal.tsx                # Modal de imagen
│   ├── Navbar.tsx                    # Barra de navegación
│   └── CameraList.tsx                # Listado de cámaras
├── public/
│   └── assets/
│       ├── ayuntamiento_urbanas/
│       │   └── 202088-0-trafico-camaras.kml
│       ├── ayuntamiento_m30/
│       │   └── 212166-7899870-trafico-calle30-camaras.xml
│       └── ayuntamiento_radares/
│           └── 300049-0-radares-fijos-moviles.csv
├── types/
│   └── index.ts                      # Definiciones TypeScript
├── package.json
├── next.config.js
├── tailwind.config.ts
└── vercel.json
```

## 🎨 Características de diseño

### Colores por fuente
- 🟢 **Verde** - Cámaras urbanas
- 🟠 **Naranja** - Cámaras M-30
- 🔴 **Rojo** - Radares

### Responsive
- **Móvil** (< 768px): Menú hamburguesa, diseño vertical
- **Tablet** (768px - 1024px): Diseño optimizado para pantallas medianas
- **Desktop** (> 1024px): Menú horizontal completo

### Modo oscuro
- Toggle en barra de navegación
- Persistencia en localStorage
- Respeta preferencias del sistema

## 📋 Instalación (si tienes permisos)

Si puedes instalar dependencias en tu equipo:

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar producción
npm start
```

## 🌐 Deploy en Vercel

### Opción 1: Desde la interfaz web de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa este repositorio
4. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Haz clic en "Deploy"

### Opción 2: Desde CLI (si puedes instalar Vercel CLI)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Hacer login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Configurar dominio personalizado

1. Ve a tu proyecto en Vercel Dashboard
2. Ve a "Settings" > "Domains"
3. Añade: `camarasmadrid.vercel.app`
4. Vercel lo configurará automáticamente

## 📊 API Endpoints

- `GET /api/cameras/all` - Todas las cámaras y radares
- `GET /api/cameras/urbanas` - Cámaras urbanas (KML)
- `GET /api/cameras/m30` - Cámaras M-30 (XML)
- `GET /api/cameras/radares` - Radares (CSV)

## 🎯 Uso

1. **Visualizar mapa**: El mapa se carga automáticamente centrado en Madrid
2. **Filtrar**: Usa los interruptores en la barra superior para filtrar por fuente
3. **Ver cámara**: Haz clic en un marcador para ver la información
4. **Modal de imagen**: Haz clic en "Ver imagen" para abrir el modal
5. **Pantalla completa**: Haz clic en la imagen del modal para expandir
6. **Listado**: Botón "Listado" para ver todas las cámaras en formato lista
7. **Buscar**: Usa la barra de búsqueda en el listado
8. **Ordenar**: Ordena por nombre, fuente o tipo
9. **Modo oscuro**: Toggle en la barra de navegación

## 🔧 Personalización

### Añadir nuevas fuentes de datos

1. Añade el archivo a `/public/assets/nueva_fuente/`
2. Crea una nueva API route en `/app/api/cameras/nueva_fuente/route.ts`
3. Parsea el archivo y retorna JSON con la estructura:
```typescript
{
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  source: string;
  type: 'camera' | 'radar';
}
```
4. Añade el filtro en `types/index.ts` (FilterState)
5. Actualiza los colores en `components/Navbar.tsx`

### Cambiar el centro del mapa

Edita `components/MapComponent.tsx`:
```typescript
<MapContainer
  center={[40.4168, -3.7038]} // [latitud, longitud]
  zoom={12}
  ...
>
```

## 📝 Notas importantes

- Los archivos de ejemplo en `/public/assets/` contienen datos de muestra
- Reemplázalos con los archivos reales del Ayuntamiento de Madrid
- Las URLs de imágenes en los archivos de ejemplo son placeholders
- Los errores de TypeScript mostrados son normales antes de instalar dependencias

## 🐛 Troubleshooting

### El mapa no se carga
- Verifica que los archivos estén en `/public/assets/`
- Revisa la consola del navegador para errores
- Asegúrate de que las rutas de API funcionen: `/api/cameras/all`

### Las imágenes no aparecen
- Verifica que las URLs en los archivos de datos sean válidas
- Algunas cámaras pueden no tener imagen disponible
- Los radares generalmente no tienen imagen en vivo

### El modo oscuro no persiste
- Verifica que localStorage esté habilitado en el navegador
- Limpia la caché del navegador

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

## 👤 Autor

Creado para visualización de datos públicos del Ayuntamiento de Madrid.

---

**¡Listo para desplegar en Vercel!** 🚀
