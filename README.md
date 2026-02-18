# 🚀 WOND - Juego de Trivia con NPL
Este proyecto es una plataforma que simula el Juego Quiero ser Millonario con NPL e interactiva que utiliza una API de Inteligencia Artificial para generar contenido dinámico sobre TIC's.
*Almacenando las preguntas en una base de datos (Firebase).*

## 👥 Equipo de Desarrollo
* **Sebastián Chocho** - Full Stack Developer
* **Aidan Carpio** - Full Stack Developer
* **Evelyn Valverde** - Full Stack Developer

## 📋 Características Principales
* **Generación con IA**: Crea bancos de 20 preguntas únicas sobre TIC's.
* **Validación de Duplicados**: Evita repetir las misma preguntas 20 preguntas generadas.
* **Game Design**: Temporizador dinámico, comodín de llamada (+15s) y escala de premios hasta $1,000,000.
* **Analytics**: Exportación de resultados de jugadores en formato CSV.

### File Tree: UIDEtriviaNPL

```
├── 📁 Backend
│   ├── 📁 routes
│   │   └── 📄 questions.js
│   ├── 📄 firebaseConfig.js
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 server.js
│   └── ⚙️ wond.json
├── 📁 Frontend
│   ├── 📁 public
│   │   └── 🖼️ vite.svg
│   ├── 📁 src
│   │   ├── 📁 assets
│   │   │   ├── 🖼️ logo-wond.png
│   │   │   └── 🖼️ react.svg
│   │   ├── 📁 components
│   │   │   ├── 📄 Game.jsx
│   │   │   ├── 📄 GameResult.jsx
│   │   │   ├── 📄 MainMenu.jsx
│   │   │   ├── 📄 Scoreboard.jsx
│   │   │   ├── 📄 Settings.jsx
│   │   │   └── 📄 SetupPlayer.jsx
│   │   ├── 📁 data
│   │   │   └── ⚙️ questions.json
│   │   ├── 📁 services
│   │   │   ├── 📄 aiService.js
│   │   │   └── 📄 storageService.js
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.jsx
│   │   ├── 🎨 index.css
│   │   └── 📄 main.jsx
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 tailwind.config.js
│   ├── ⚙️ tsconfig.app.json
│   ├── ⚙️ tsconfig.json
│   ├── ⚙️ tsconfig.node.json
│   └── 📄 vite.config.ts
├── 📁 Mineria_Datos
│   ├── 📁 Predicciones
│   │   ├── 🐍 app.py
│   │   ├── 📄 datos_sinteticos_rendimiento.csv
│   │   ├── 🐍 entrenador.py
│   │   ├── 🐍 firebase_connector.py
│   │   ├── 📄 mapping_nombres.pkl
│   │   ├── 📄 modelo_probabilidad.pkl
│   │   └── ⚙️ wond_prediccion.json
│   └── 📄 mtodologia KDD.ipynb
├── ⚙️ .gitignore
├── 📝 README.md
└── 📄 src.lnk
```


## 📝 Licencia
Proyecto desarrollado para fines académicos y de entrenamiento en tecnologías.
