# 🚀 Cómo ejecutar el proyecto SIN INSTALACIÓN (Node.js Portable)

## ⚠️ Problema detectado
No tienes Node.js instalado y no tienes permisos para instalarlo.

## ✅ Solución: Node.js Portable

### Opción 1: Node.js Portable (Sin permisos de administrador)

1. **Descargar Node.js Portable**
   - Ve a: https://nodejs.org/en/download/
   - O directamente: https://nodejs.org/dist/v20.10.0/node-v20.10.0-win-x64.zip
   - Descarga el archivo ZIP (Windows Binary x64)

2. **Extraer en tu carpeta de usuario**
   ```
   c:\Users\ejkitano\node-portable\
   ```
   - Descomprime el ZIP en esa carpeta
   - NO requiere permisos de administrador
   - Quedaría: c:\Users\ejkitano\node-portable\node.exe

3. **Añadir a PATH de PowerShell (temporal)**
   ```powershell
   # Navega a la carpeta del proyecto
   cd c:\Users\ejkitano\VSCode\camarasmadrid
   
   # Añade Node.js portable al PATH de esta sesión
   $env:Path = "c:\Users\ejkitano\node-portable;$env:Path"
   
   # Verifica que funciona
   node --version
   npm --version
   ```

4. **Instalar dependencias**
   ```powershell
   npm install
   ```

5. **Ejecutar el proyecto**
   ```powershell
   npm run dev
   ```

6. **Abrir en navegador**
   - Abre: http://localhost:3000

### Opción 2: Usar VS Code con Node.js integrado

Si tienes VS Code instalado, puede que ya tenga Node.js integrado:

1. En VS Code, abre una terminal
2. Intenta:
   ```powershell
   & "C:\Program Files\Microsoft VS Code\resources\app\extensions\ms-vscode.js-debug\dist\src\targets\node\bootloader.js" --version
   ```

### Opción 3: Portable con nvm-windows (Gestor de versiones)

1. Descarga nvm-windows portable de:
   https://github.com/coreybutler/nvm-windows/releases
   - Busca: nvm-noinstall.zip
   - Descomprime en: c:\Users\ejkitano\nvm-portable\

2. Crea archivo settings.txt:
   ```
   root: c:\Users\ejkitano\nvm-portable
   path: c:\Users\ejkitano\nodejs
   ```

3. Usa nvm para instalar Node.js:
   ```powershell
   .\nvm.exe install 20.10.0
   .\nvm.exe use 20.10.0
   ```

### Opción 4: Ejecutar en GitHub Codespaces (GRATIS)

Si no puedes ejecutar localmente, usa GitHub Codespaces:

1. Sube el proyecto a GitHub (ver COMANDOS_GIT.txt)
2. Ve a tu repositorio en GitHub
3. Click en el botón verde "Code"
4. Selecciona la pestaña "Codespaces"
5. Click "Create codespace on main"
6. Espera que cargue (1-2 minutos)
7. En la terminal del Codespace:
   ```bash
   npm install
   npm run dev
   ```
8. GitHub te dará una URL pública para ver tu app

**VENTAJAS:**
- ✅ Gratis (60 horas/mes)
- ✅ No necesitas instalar nada
- ✅ VS Code en el navegador
- ✅ Terminal completo
- ✅ Todo funciona igual que en local

### Opción 5: StackBlitz (Ejecutar en navegador)

La forma MÁS RÁPIDA sin instalar nada:

1. Ve a https://stackblitz.com
2. Click "New Project" → "Next.js"
3. Sube tus archivos (drag & drop)
4. Automáticamente instala y ejecuta
5. ¡Listo! Se ve en tiempo real

**O importa desde GitHub:**
1. Sube a GitHub primero
2. Ve a: https://stackblitz.com/github/TU_USUARIO/camarasmadrid
3. Se ejecuta automáticamente

## 📋 Comandos para ejecutar (una vez tengas Node.js)

```powershell
# 1. Navegar al proyecto
cd c:\Users\ejkitano\VSCode\camarasmadrid

# 2. Instalar dependencias (solo primera vez)
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir navegador en: http://localhost:3000
```

## 🔧 Script de ejecución automático

Guarda esto como `iniciar.ps1` y ejecútalo:

```powershell
# Ruta a Node.js portable
$nodePath = "c:\Users\ejkitano\node-portable"

# Añadir al PATH
$env:Path = "$nodePath;$env:Path"

# Ir al proyecto
Set-Location "c:\Users\ejkitano\VSCode\camarasmadrid"

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Green
node --version
npm --version

# Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "`nInstalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Ejecutar proyecto
Write-Host "`nIniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host "Abre tu navegador en: http://localhost:3000" -ForegroundColor Cyan
npm run dev
```

## ⚡ Opción INSTANTÁNEA: Deploy directo a Vercel

Si solo quieres ver el proyecto funcionando:

1. Sube a GitHub (ver COMANDOS_GIT.txt)
2. Ve a https://vercel.com
3. Import project
4. Deploy
5. ¡En 2 minutos está online!

**No necesitas ejecutar nada localmente para desplegarlo.**

## 🆘 Problemas comunes

### Error: "npm no se reconoce"
- Solución: Node.js portable no está en el PATH
- Ejecuta: `$env:Path = "c:\Users\ejkitano\node-portable;$env:Path"`

### Error: "Cannot find module"
- Solución: Falta instalar dependencias
- Ejecuta: `npm install`

### Error: "Puerto 3000 en uso"
- Solución: Cambia el puerto
- Ejecuta: `npm run dev -- -p 3001`

### Error: "Permission denied"
- Solución: Ejecuta PowerShell como usuario normal (no admin)
- O usa Codespaces/StackBlitz

## 📞 Recomendación

Dado que no tienes permisos para instalar:

**1. MEJOR OPCIÓN: GitHub Codespaces**
   - Gratis, sin instalación
   - Funciona 100%
   - VS Code completo en navegador

**2. SEGUNDA OPCIÓN: Node.js Portable**
   - Descarga ZIP
   - Extrae en tu carpeta de usuario
   - Funciona sin permisos

**3. TERCERA OPCIÓN: Deploy directo a Vercel**
   - No ejecutas localmente
   - Ves el resultado en producción
   - Es lo más rápido

## 🎯 Mi recomendación personal

Usa **GitHub Codespaces**:
1. Es gratis
2. No necesitas instalar nada
3. Funciona perfectamente
4. Tienes 60 horas gratis al mes
5. Es como VS Code pero en el navegador

---

**¿Necesitas ayuda?** Lee los otros archivos:
- `DEPLOY.md` - Para desplegar sin ejecutar localmente
- `COMANDOS_GIT.txt` - Para subir a GitHub
- `README.md` - Documentación completa
