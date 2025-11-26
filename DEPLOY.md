# Guía rápida de deploy en Vercel (sin instalar nada)

## 🎯 Opción más simple: Deploy directo desde GitHub

### Paso 1: Subir el código a GitHub

1. Ve a [github.com](https://github.com) y crea un nuevo repositorio llamado `camarasmadrid`
2. No inicialices con README (ya tenemos uno)
3. Copia los comandos que GitHub te muestra

En tu terminal de PowerShell (en la carpeta del proyecto):

```powershell
# Inicializar git
git init

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Cámaras Madrid webapp"

# Añadir remote (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/camarasmadrid.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

### Paso 2: Deploy en Vercel desde GitHub

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up" o "Log In"
3. Elige "Continue with GitHub"
4. Autoriza Vercel en GitHub
5. Haz clic en "New Project"
6. Verás tu repositorio `camarasmadrid` - haz clic en "Import"
7. **Configuración del proyecto**:
   - Framework Preset: **Next.js** (se detecta automáticamente)
   - Root Directory: `./` (dejar por defecto)
   - Build Command: `npm run build` (viene por defecto)
   - Output Directory: `.next` (viene por defecto)
   - Install Command: `npm install` (viene por defecto)
8. Haz clic en "Deploy"
9. Espera 2-3 minutos mientras Vercel:
   - Instala las dependencias
   - Construye el proyecto
   - Despliega la aplicación

### Paso 3: Configurar el dominio

Una vez desplegado:

1. Ve a tu proyecto en Vercel
2. Haz clic en "Settings" en el menú superior
3. Ve a "Domains" en el menú lateral
4. Por defecto tendrás algo como: `camarasmadrid-abc123.vercel.app`
5. Para obtener `camarasmadrid.vercel.app`:
   - Si está disponible, Vercel te lo asignará automáticamente
   - Si no, tendrás que usar el dominio generado automáticamente

## 🚀 Actualizaciones futuras

Cada vez que hagas cambios:

```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel detectará los cambios y desplegará automáticamente.

## 🔧 Sin Git/GitHub (alternativa)

Si no puedes usar Git:

### Opción A: Vercel CLI portable (sin instalación global)

1. Descarga el proyecto como ZIP
2. Sube el ZIP a un servicio de almacenamiento temporal
3. Usa la versión web de Vercel para importar desde URL

### Opción B: Arrastra y suelta

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. NO ES POSIBLE con Next.js - Vercel requiere Git

## ✅ Verificación post-deploy

Después del deploy, verifica:

1. ✅ La página principal carga
2. ✅ El mapa de Leaflet se muestra
3. ✅ Los marcadores aparecen en Madrid
4. ✅ Los filtros funcionan
5. ✅ El modal de imágenes se abre
6. ✅ El listado de cámaras funciona
7. ✅ El modo oscuro funciona
8. ✅ El diseño responsive funciona en móvil

## 🐛 Problemas comunes

### "Build failed"
- Vercel instalará automáticamente las dependencias
- Si falla, revisa los logs en Vercel Dashboard
- Los errores de TypeScript mostrados en VSCode son normales y se resolverán en el build

### "Module not found"
- Vercel instala todas las dependencias de `package.json`
- No necesitas instalar nada localmente

### Las APIs no funcionan
- Vercel configura automáticamente las rutas de API
- Los archivos en `/public/` se sirven automáticamente

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard > Tu Proyecto > Deployments > [último deploy] > Building
2. Verifica que todos los archivos estén en GitHub
3. Asegúrate de que la estructura de carpetas sea correcta

## 🎉 ¡Listo!

Tu aplicación estará en línea en:
- `https://camarasmadrid.vercel.app` (si el nombre está disponible)
- O en el dominio que Vercel te asigne automáticamente

**No necesitas instalar Node.js, npm ni nada en tu equipo local para desplegar en Vercel.**
