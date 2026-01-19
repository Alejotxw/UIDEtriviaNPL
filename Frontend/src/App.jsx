import React, { useState, useEffect } from "react";
// Importación de tus archivos locales
import d1 from "./data/1.json";
import d2 from "./data/2.json";
import d3 from "./data/3.json";
import d4 from "./data/4.json";
import d5 from "./data/5.json";

import MainMenu from "./components/MainMenu.jsx";
import SetupPlayer from "./components/SetupPlayer.jsx";
import Game from "./components/Game.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import Settings from "./components/Settings.jsx";

function App() {
  const [view, setView] = useState('menu');
  const [playerName, setPlayerName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [wildcardActive, setWildcardActive] = useState(true);
  const [difficultyTime, setDifficultyTime] = useState(30);

  // Función para mezclar y seleccionar 10 preguntas de tus archivos
  const prepareGame = () => {
    const allQuestions = [...d1, ...d2, ...d3, ...d4, ...d5];
    
    // Filtrar duplicados y basura
    const clean = allQuestions.filter(q => !q.question.includes("inicialización"));
    const unique = Array.from(new Map(clean.map(q => [q.question, q])).values());

    // Seleccionar 10 al azar
    const selected = unique.sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(selected);
  };

  useEffect(() => {
    if (view === 'game') prepareGame();
  }, [view]);

  const saveScore = (name, score) => {
    const saved = JSON.parse(localStorage.getItem('scores') || '[]');
    const newScores = [...saved, { name, score, date: new Date().toLocaleDateString() }]
      .sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('scores', JSON.stringify(newScores));
  };

  return (
    <div className="app-container">
      {view === 'menu' && <MainMenu setView={setView} />}
      {view === 'setup' && <SetupPlayer setView={setView} setPlayerName={setPlayerName} />}
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
      {view === 'scores' && <Scoreboard scores={JSON.parse(localStorage.getItem('scores') || '[]')} setView={setView} />}
      {view === 'settings' && <Settings setView={setView} wildcardActive={wildcardActive} setWildcardActive={setWildcardActive} difficultyTime={difficultyTime} setDifficultyTime={setDifficultyTime} />}
    </div>
  );
}

export default App;