import React, { useState, useEffect } from "react";
// Importación de los 5 archivos JSON (Base de Datos Local)
import d1 from "./data/1.json"; 
import d2 from "./data/2.json"; 
import d3 from "./data/3.json"; 
import d4 from "./data/4.json"; 
import d5 from "./data/5.json"; 

// Importación de Componentes
import MainMenu from "./components/MainMenu.jsx";
import SetupPlayer from "./components/SetupPlayer.jsx";
import Game from "./components/Game.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import Settings from "./components/Settings.jsx";

function App() {
  // Estados de navegación y configuración
  const [view, setView] = useState('menu');
  const [playerName, setPlayerName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [wildcardActive, setWildcardActive] = useState(true);
  const [difficultyTime, setDifficultyTime] = useState(30);

  // ESCALA DE PREMIOS ACTUALIZADA (10 Niveles hasta el Millón)
  const escalaPremios = [100, 500, 1000, 5000, 15000, 50000, 100000, 250000, 500000, 1000000];

  /**
   * Prepara el banco de preguntas para una nueva partida
   * Une los 5 JSON, limpia duplicados y asigna la escala de premios.
   */
  const prepareGame = () => {
    // 1. Unir todos los datos
    const allData = [...d1, ...d2, ...d3, ...d4, ...d5];
    
    // 2. Filtrar preguntas de "inicialización" y limpiar espacios
    const filtered = allData.filter(q => 
      q.question && !q.question.toLowerCase().includes("inicialización")
    );

    // 3. Eliminar duplicados exactos usando un Map (por texto de pregunta)
    const uniqueMap = new Map();
    filtered.forEach(q => {
      const key = q.question.trim().toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, q);
      }
    });
    const uniqueQuestions = Array.from(uniqueMap.values());

    // 4. Barajar y seleccionar 10 preguntas
    const shuffled = uniqueQuestions.sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, 10);

    // 5. Inyectar la escala de premios correcta (del 100 al 1.000.000)
    const finalQuestions = selection.map((q, index) => ({
      ...q,
      prize: escalaPremios[index]
    }));

    setQuestions(finalQuestions);
  };

  // Cada vez que la vista cambie a 'game', preparamos preguntas nuevas
  useEffect(() => {
    if (view === 'game') {
      prepareGame();
    }
  }, [view]);

  /**
   * Guarda el puntaje en LocalStorage y mantiene solo el Top 10
   */
  const saveScore = (name, score) => {
    const saved = JSON.parse(localStorage.getItem('scores') || '[]');
    const newEntry = { 
      name: name || "Anónimo", 
      score: score, 
      date: new Date().toLocaleDateString() 
    };
    
    const updatedScores = [...saved, newEntry]
      .sort((a, b) => b.score - a.score) // Ordenar de mayor a menor
      .slice(0, 10); // Mantener solo los 10 mejores
      
    localStorage.setItem('scores', JSON.stringify(updatedScores));
  };

  return (
    <div className="app-container">
      {/* RENDERIZADO CONDICIONAL DE VISTAS */}
      
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
        <Scoreboard setView={setView} />
      )}

      {view === 'settings' && (
        <Settings 
          setView={setView} 
          wildcardActive={wildcardActive} 
          setWildcardActive={setWildcardActive} 
          difficultyTime={difficultyTime} 
          setDifficultyTime={setDifficultyTime} 
        />
      )}
    </div>
  );
}

export default App;