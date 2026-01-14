import React, { useState, useEffect } from 'react';
import { generateQuizData } from '../services/aiService';
import GameResult from './GameResult'; // Asegúrate de haber creado este archivo

const Game = ({ playerName, setView, saveScore, wildcardActive, difficultyTime }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficultyTime || 30);
  const [selected, setSelected] = useState(null);
  const [hasUsedPhone, setHasUsedPhone] = useState(false);
  const [credits, setCredits] = useState(0);
  
  // Estados para la pantalla final
  const [showResult, setShowResult] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // 1. Carga inicial de preguntas desde la IA (DeepSeek)
// ... dentro de Game.jsx ...

useEffect(() => {
  const initGame = async () => {
    setLoading(true); // Aseguramos que muestre carga al reiniciar
    try {
      const rawData = await generateQuizData();
      const data = JSON.parse(rawData); // Parseamos el contenido de la IA
      
      if (data && data.questions) {
        // Opcional: Barajar las opciones internamente si quieres más aleatoriedad
        setQuestions(data.questions);
        setLoading(false);
      }
    } catch (error) {
      console.error("Fallo al cargar preguntas:", error);
      setView('menu');
    }
  };
  initGame();
}, []); // Solo se ejecuta al montar el componente del juego

  // 2. Lógica del Cronómetro
  useEffect(() => {
    if (!loading && !showResult && timeLeft > 0 && selected === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleEnd(false);
    }
  }, [timeLeft, loading, selected, showResult]);

  // 3. Manejo de respuestas
  const handleAnswer = (index) => {
    setSelected(index);
    const isCorrect = index === questions[currentIdx].correct;

    setTimeout(() => {
      if (isCorrect) {
        const prizeEarned = questions[currentIdx].prize;
        setCredits(prizeEarned);

        if (currentIdx + 1 < questions.length) {
          // Siguiente pregunta
          setCurrentIdx(currentIdx + 1);
          setTimeLeft(difficultyTime || 30);
          setSelected(null);
        } else {
          // Ganó el juego completo
          handleEnd(true, prizeEarned);
        }
      } else {
        // Respuesta incorrecta
        handleEnd(false);
      }
    }, 1500);
  };

  // 4. Finalización del juego
  const handleEnd = (win = false, finalScore = credits) => {
    setIsWin(win);
    setShowResult(true);
    saveScore(playerName, finalScore);
  };

  // 5. Comodín de llamada
  const usePhone = () => {
    if (!hasUsedPhone && !showResult) {
      setTimeLeft(prev => prev + 30);
      setHasUsedPhone(true);
    }
  };

  // Pantalla de carga mientras la IA responde
  if (loading) return (
    <div className="settings-overlay">
      <div className="settings-card">
        <div className="loader"></div>
        <h2 className="settings-title">🤖 IA GENERANDO DESAFÍO</h2>
        <p>DeepSeek está preparando tus preguntas...</p>
      </div>
    </div>
  );

  const currentQ = questions[currentIdx];

  return (
    <div className="game-screen-layout">
      {/* HEADER: Créditos, Cronómetro y Comodín */}
      <div className="game-top-bar">
        <div className="player-tag">💰 ${credits.toLocaleString()}</div>
        
        <div className="timer-box">
          <span className="timer-label">PREGUNTA {currentIdx + 1}/10</span>
          <span className="timer-value" style={{ color: timeLeft <= 5 ? '#ff4444' : '#fff' }}>
            {timeLeft}s
          </span>
        </div>

        <div className="wildcard-section">
          {wildcardActive && (
            <button 
              onClick={usePhone} 
              disabled={hasUsedPhone} 
              className={`btn-circle ${hasUsedPhone ? 'used' : ''}`}
            >
              📞
            </button>
          )}
        </div>
      </div>

      <div className="game-main-content">
        {/* CUADRO DE PREGUNTA */}
        <div className="question-card">
          <h3 className="question-text">{currentQ.question}</h3>
          <div className="options-grid">
            {currentQ.options.map((opt, i) => (
              <button 
                key={i} 
                className={`option-btn ${
                  selected === i 
                    ? (i === currentQ.correct ? 'correct' : 'wrong') 
                    : ''
                }`}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}:</span> {opt}
              </button>
            ))}
          </div>
        </div>
        
        {/* CUADRO DE PREMIOS (ESCALERA) */}
        <div className="prize-card">
          <h4 className="prize-title">PREMIOS</h4>
          <div className="prize-list">
            {questions.map((q, i) => (
              <div 
                key={i} 
                className={`prize-row ${i === currentIdx ? 'active-prize' : ''} ${i < currentIdx ? 'passed-prize' : ''}`}
              >
                <span className="prize-number">{i + 1}</span>
                <span className="prize-amount">${q.prize.toLocaleString()}</span>
              </div>
            )).reverse()}
          </div>
        </div>
      </div>

      {/* FOOTER: Nombre del Jugador */}
      <div className="player-footer">
        JUGANDO: <span>{playerName}</span>
      </div>

      {/* PANTALLA DE RESULTADO (MODAL) */}
      {showResult && (
        <GameResult 
          win={isWin} 
          score={credits} 
          playerName={playerName} 
          onRestart={() => setView('menu')} 
        />
      )}
    </div>
  );
};

export default Game;