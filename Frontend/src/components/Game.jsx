import React, { useState, useEffect } from 'react';
import GameResult from './GameResult';

const Game = ({ playerName, questions, setView, saveScore, wildcardActive, difficultyTime }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficultyTime);
  const [selected, setSelected] = useState(null);
  const [credits, setCredits] = useState(0); // Dinero acumulado que el jugador ya "aseguró"
  const [hasUsedPhone, setHasUsedPhone] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // Control del temporizador
  useEffect(() => {
    if (showResult) return;
    if (timeLeft <= 0) {
      handleAnswer(null); // Si el tiempo se agota, se toma como respuesta incorrecta
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const currentQ = questions[currentIdx];

  // Lógica del comodín del teléfono (+15 segundos)
  const handlePhoneClick = () => {
    if (!hasUsedPhone && wildcardActive) {
      setTimeLeft(prev => prev + 15);
      setHasUsedPhone(true);
    }
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);

    setTimeout(() => {
      if (idx === currentQ.correct) {
        const premioDeEstaPregunta = currentQ.prize;
        
        // Si es la última pregunta, gana el juego
        if (currentIdx + 1 < questions.length) {
          setCredits(premioDeEstaPregunta); // Actualiza el acumulado al premio de la pregunta actual
          setCurrentIdx(prev => prev + 1);
          setTimeLeft(difficultyTime);
          setSelected(null);
        } else {
          // Victoria total: 1,000,000
          setIsWin(true);
          setCredits(premioDeEstaPregunta);
          setShowResult(true);
          saveScore(playerName, premioDeEstaPregunta);
        }
      } else {
        // Al fallar, el jugador se queda con lo que acumuló en la pregunta anterior
        setShowResult(true);
        saveScore(playerName, credits);
      }
    }, 1200);
  };

  return (
    <div className="game-wrapper">
      {/* HUD SUPERIOR: Información de jugador, dinero y tiempo */}
      <div className="game-header">
        <div className="info-card">
          <div className="info-label">JUGADOR</div>
          <div className="info-value">{playerName}</div>
        </div>
        
        <div className="info-card money-card">
          <div className="info-label">ACUMULADO</div>
          <div className="info-value money-value">${credits.toLocaleString()}</div>
        </div>

        <div className="info-card" style={{borderColor: timeLeft < 10 ? '#ff4444' : '#00d4ff'}}>
          <div className="info-label">TIEMPO</div>
          <div className="info-value">{timeLeft}s</div>
        </div>

        {wildcardActive && (
          <button 
            className={`phone-card ${hasUsedPhone ? 'used' : ''}`} 
            onClick={handlePhoneClick}
            disabled={hasUsedPhone}
          >
            📞
          </button>
        )}
      </div>

      <div className="main-game-layout">
        {/* PANEL IZQUIERDO: Pregunta y Opciones */}
        <div className="left-panel">
          <div className="question-card">
            <span className="category-tag">{currentQ.category.toUpperCase()}</span>
            <h2 className="question-text">{currentQ.question}</h2>
          </div>

          <div className="options-grid">
            {currentQ.options.map((opt, i) => (
              <button 
                key={i} 
                className={`option-btn ${selected === i ? (i === currentQ.correct ? 'correct' : 'wrong') : ''}`} 
                onClick={() => handleAnswer(i)} 
                disabled={selected !== null}
              >
                <b style={{color: 'var(--gold)', marginRight: '10px'}}>{String.fromCharCode(65 + i)}:</b> {opt}
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO: Tablero de Premios (Escala al Millón) */}
        <div className="prize-card">
          <h4 className="prize-title">ESCALA AL MILLÓN</h4>
          <div className="prize-list">
            {questions.map((q, i) => (
              <div 
                key={i} 
                className={`prize-row ${i === currentIdx ? 'active-prize' : ''} ${i < currentIdx ? 'passed-prize' : ''}`}
              >
                <span className="prize-number">{i + 1}</span>
                <span className="prize-amount">${q.prize.toLocaleString()}</span>
              </div>
            )).reverse()} {/* .reverse() para que el millón salga arriba */}
          </div>
        </div>
      </div>

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