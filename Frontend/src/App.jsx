import React, { useState, useEffect } from "react";
import MainMenu from "./components/MainMenu.jsx";
import SetupPlayer from "./components/SetupPlayer.jsx";
import Game from "./components/Game.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import Settings from "./components/Settings.jsx";

function App() {
  const [view, setView] = useState('menu');
  const [playerName, setPlayerName] = useState('');
  const [finalResult, setFinalResult] = useState({ win: false, score: 0 });
  
  // --- NUEVOS ESTADOS DE CONFIGURACIÓN ---
  const [wildcardActive, setWildcardActive] = useState(true);
  const [difficultyTime, setDifficultyTime] = useState(30);

  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('scores');
    return saved ? JSON.parse(saved) : [];
  });

  const saveScore = (name, score) => {
    const newScores = [...highScores, { name, score, date: new Date().toLocaleDateString() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setHighScores(newScores);
    localStorage.setItem('scores', JSON.stringify(newScores));
  };

  return (
    <div className="app-container">
      {view === 'menu' && <MainMenu setView={setView} />}
      
      {view === 'setup' && <SetupPlayer setView={setView} setPlayerName={setPlayerName} />}
      
      {/* Pasamos la configuración al Juego */}
      {view === 'game' && (
        <Game 
          playerName={playerName} 
          setView={setView} 
          saveScore={saveScore} 
          wildcardActive={wildcardActive} 
          difficultyTime={difficultyTime} 
        />
      )}
      
      {view === 'scores' && <Scoreboard scores={highScores} setView={setView} />}
      
      {/* Pasamos los estados y sus funciones de cambio a Settings */}
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