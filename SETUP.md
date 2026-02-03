# 🚀 Configuración del Proyecto Trivia NLP

## Estructura del Proyecto

```
UIDEtriviaNPL/
├── Frontend/          # Aplicación React (Puerto 5173)
├── Backend/           # Servidor Express (Puerto 5000)
└── google-colab/      # Jupyter Notebooks
```

## ⚙️ Instalación y Ejecución

### 1️⃣ Backend (Guardar archivos JSON)

**Requisitos:**
- Node.js v16+ instalado
- npm o yarn

**Instalación:**
```bash
cd Backend
npm install
```

**Ejecutar:**
```bash
npm start        # Ejecución normal
npm run dev      # Ejecución con auto-reload (recomendado)
```

El servidor estará disponible en: **http://localhost:5000**

**Endpoints disponibles:**
- `POST /api/save-questions` - Guardar preguntas generadas por IA en /data
- `GET /api/saved-files` - Obtener lista de archivos guardados
- `GET /api/health` - Verificar estado del servidor

### 2️⃣ Frontend (Aplicación React)

**Requisitos:**
- Node.js v16+ instalado
- npm o yarn
- Backend ejecutándose en http://localhost:5000

**Instalación:**
```bash
cd Frontend
npm install
```

**Ejecutar:**
```bash
npm run dev      # Desarrollo con Vite
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Verificar código con ESLint
```

El frontend estará disponible en: **http://localhost:5173**

## 🎮 Cómo Usar la Función de Generar y Guardar JSON

1. Inicia sesión en el juego
2. Ve a **⚙️ CONFIGURACIÓN**
3. En la sección **BANCO DE DATOS (IA)**, presiona: **✨ GENERAR Y GUARDAR JSON**
4. El sistema generará 20 preguntas nuevas con DeepSeek IA
5. Se guardarán automáticamente en: `/Frontend/src/data/preguntas_ia_[timestamp].json`

## 📁 Estructura de Directorios

```
Frontend/
├── src/
│   ├── components/      # Componentes React (Game, Settings, etc.)
│   ├── data/           # 📊 Aquí se guardan los JSONs generados por IA
│   │   ├── Data1.json - Data5.json  (Base de datos inicial)
│   │   └── preguntas_ia_*.json      (Archivos generados por IA)
│   └── services/       # Servicios (IA, almacenamiento)
│       ├── aiService.js           (Llamadas a DeepSeek API)
│       └── storageService.js      (Comunicación con Backend)
│
Backend/
├── server.js           # Servidor Express principal
└── package.json
```

## 🔧 Variables de Entorno (Opcional)

En `Frontend/src/services/storageService.js`, si necesitas cambiar la URL del backend:

```javascript
const BACKEND_URL = "http://localhost:5000"; // Cambiar si es necesario
```

## ✅ Verificación de Instalación

1. **Backend activo:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Debería retornar: `{"status":"Backend running"}`

2. **Frontend conectado:**
   - Abre http://localhost:5173
   - Ve a Configuración
   - Si ves el botón "✨ GENERAR Y GUARDAR JSON" funcionando, está todo correcto

## ⚠️ Posibles Problemas

### "El servidor backend no está disponible"
- Asegúrate de ejecutar `npm run dev` en la carpeta Backend
- Verifica que el puerto 5000 no esté en uso

### "Error al guardar el archivo"
- Verifica que tienes permisos de lectura/escritura en la carpeta `/Frontend/src/data`
- Comprueba que el backend está corriendo

### "No se conecta a la API de DeepSeek"
- Verifica tu clave API en `Frontend/src/services/aiService.js`
- Asegúrate de tener conexión a internet

## 📝 API Reference

### POST /api/save-questions
Guarda preguntas generadas en la carpeta `/data`

**Request:**
```json
{
  "questions": [
    {
      "question": "¿Qué es...",
      "options": ["...", "...", "...", "..."],
      "correct": 0,
      "category": "..."
    }
  ],
  "filename": "preguntas_ia_opcional.json"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Archivo guardado correctamente",
  "filename": "preguntas_ia_1234567890.json",
  "path": "C:\\...\\Frontend\\src\\data\\preguntas_ia_1234567890.json"
}
```

---

✨ **¡Proyecto optimizado y listo para generar preguntas automáticamente!**
