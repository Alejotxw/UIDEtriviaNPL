import React, { useState, useEffect } from "react";
// Importación de los 7 archivos JSON (Base de Datos Local)
import d1 from "./data/Data1.json"; 
import d2 from "./data/Data2.json"; 
import d3 from "./data/Data3.json"; 
import d4 from "./data/Data4.json"; 
import d5 from "./data/Data5.json"; 

// Importación de Componentes
import MainMenu from "./components/MainMenu.jsx";
import SetupPlayer from "./components/SetupPlayer.jsx";
import Game from "./components/Game.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import Settings from "./components/Settings.jsx";

// Importación del servicio de IA
import { generateQuizData } from "./services/aiService";
// Importación del servicio de almacenamiento
import { saveQuestionsToServer, checkBackendHealth } from "./services/storageService";

function App() {
  // Estados de navegación y configuración
  const [view, setView] = useState('menu');
  const [playerName, setPlayerName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [wildcardActive, setWildcardActive] = useState(true);
  const [difficultyTime, setDifficultyTime] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false); // Estado para feedback de carga

  // ESCALA DE PREMIOS ACTUALIZADA (10 Niveles hasta el Millón)
  const escalaPremios = [100, 500, 1000, 5000, 15000, 50000, 100000, 250000, 500000, 1000000];

  /**
   * Prepara el banco de preguntas para una nueva partida
   */
  const prepareGame = () => {
    const allData = [...d1, ...d2, ...d3, ...d4, ...d5];
    
    const filtered = allData.filter(q => 
      q.question && !q.question.toLowerCase().includes("inicialización")
    );

    const uniqueMap = new Map();
    filtered.forEach(q => {
      const key = q.question.trim().toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, q);
      }
    });
    const uniqueQuestions = Array.from(uniqueMap.values());

    const shuffled = uniqueQuestions.sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, 10);

    const finalQuestions = selection.map((q, index) => ({
      ...q,
      prize: escalaPremios[index]
    }));

    setQuestions(finalQuestions);
  };

  /**
   * Lógica para generar preguntas con IA y guardar el archivo JSON
   */
  const handleGenerateBank = async () => {
    setIsGenerating(true);
    try {
      // Obtenemos textos de preguntas actuales para que la IA intente no repetirlas
      const existingTexts = questions.map(q => q.question);
      
      const data = await generateQuizData(existingTexts);
      
      if (data && data.questions && data.questions.length > 0) {
        // Guardar las preguntas (en servidor o descargar localmente)
        const saveResult = await saveQuestionsToServer(data.questions);
        
        if (saveResult.mode === 'local') {
          alert(`✅ ¡Éxito! Se descargó el archivo con ${data.questions.length} preguntas:\n📥 ${saveResult.filename}`);
        } else {
          alert(`✅ ¡Éxito! Se guardaron ${data.questions.length} preguntas en:\n📁 /Frontend/src/data/${saveResult.filename}`);
        }
      } else {
        throw new Error("No se generaron preguntas válidas");
      }
    } catch (error) {
      console.error("Error al generar banco:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (view === 'game') {
      prepareGame();
    }
  }, [view]);

  /**
   * Guarda el puntaje en LocalStorage
   */
  const saveScore = (name, score) => {
    const saved = JSON.parse(localStorage.getItem('scores') || '[]');
    const newEntry = { 
      name: name || "Anónimo", 
      score: score, 
      date: new Date().toLocaleString() // Guardamos fecha y hora
    };
    
    // Guardamos todos los registros ordenados por puntaje
    const updatedScores = [...saved, newEntry].sort((a, b) => b.score - a.score);
      
    localStorage.setItem('scores', JSON.stringify(updatedScores));
  };

  const clearScores = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todo el historial de puntuaciones?")) {
      localStorage.removeItem('scores');
      // Forzamos un re-render o alerta si es necesario
      alert("Historial borrado.");
    }
  };

  return (
    <div className="app-container">
      {view === 'menu' && (
        <MainMenu setView={setView} />
      )}

      {view === 'setup' && (
        <SetupPlayer 
          setView={setView} 
          setPlayerName={setPlayerName} 
        />
      )}

      {view === 'game' && questions.length > 0 && (
        <Game 
          playerName={playerName} 
          questions={questions} 
          setView={setView} 
          saveScore={saveScore} 
          wildcardActive={wildcardActive} 
          difficultyTime={difficultyTime} 
        />
      )}

      {view === 'scores' && (
        <Scoreboard 
          setView={setView} 
          clearScores={clearScores} // Pasamos la nueva función
        />
      )}

      {view === 'settings' && (
        <Settings 
          setView={setView} 
          wildcardActive={wildcardActive} 
          setWildcardActive={setWildcardActive} 
          difficultyTime={difficultyTime} 
          setDifficultyTime={setDifficultyTime} 
          onGenerateBank={handleGenerateBank} // Pasamos la función al componente
        />
      )}

      {/* Overlay opcional de carga para la IA */}
      {isGenerating && (
        <div className="loading-overlay">
          <p>Generando nuevas preguntas con IA...</p>
        </div>
      )}
    </div>
  );
}

export default App;