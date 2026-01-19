import React, { useState, useEffect } from 'react';
import GameResult from './GameResult';

const Game = ({ playerName, questions, setView, saveScore, wildcardActive, difficultyTime }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficultyTime);
  const [selected, setSelected] = useState(null);
  const [credits, setCredits] = useState(0); // Este es el dinero acumulado
  const [hasUsedPhone, setHasUsedPhone] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [animateMoney, setAnimateMoney] = useState(false);

  useEffect(() => {
    if (showResult) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const currentQ = questions[currentIdx];

  const handlePhoneClick = () => {
    if (!hasUsedPhone && wildcardActive) {
      setTimeLeft(prev => prev + 15);
      setHasUsedPhone(true);
    }
  };

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);

    setTimeout(() => {
      if (index === currentQ.correct) {
        // SUMAR DINERO: Acumulamos el premio de la pregunta actual
        const premioGanado = currentQ.prize;
        setCredits(prev => prev + premioGanado);
        setAnimateMoney(true); // Dispara animación
        
        setTimeout(() => setAnimateMoney(false), 500);

        if (currentIdx + 1 < questions.length) {
          setCurrentIdx(prev => prev + 1);
          setTimeLeft(difficultyTime);
          setSelected(null);
        } else {
          setIsWin(true);
          setShowResult(true);
          saveScore(playerName, credits + premioGanado);
        }
      } else {
        // Si falla, termina con lo que acumuló hasta el momento
        setShowResult(true);
        saveScore(playerName, credits);
      }
    }, 1200);
  };

  return (
    <div className="game-wrapper" style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      
      {/* HUD SUPERIOR ACTUALIZADO */}
      <div className="game-header">
        <div className="info-card">
          <div className="info-label">JUGADOR</div>
          <div className="info-value">{playerName}</div>
        </div>

        {/* NUEVO CUADRO DE DINERO ACUMULADO */}
        <div className={`info-card money-card ${animateMoney ? 'money-update' : ''}`}>
          <div className="info-label">ACUMULADO</div>
          <div className="info-value money-value">${credits.toLocaleString()}</div>
        </div>

        <div className="info-card" style={{borderColor: timeLeft < 10 ? '#ff4444' : 'var(--blue-bright)'}}>
          <div className="info-label">TIEMPO</div>
          <div className="info-value">{timeLeft}s</div>
        </div>

        {wildcardActive && (
          <button 
            className={`phone-card ${hasUsedPhone ? 'used' : ''}`}
            onClick={handlePhoneClick}
          >
            📞
          </button>
        )}
      </div>

      <div className="main-game-layout">
        <div className="left-panel">
          <div className="question-card">
            <div className="category-tag" style={{position: 'absolute', top: '-12px', background: 'var(--gold)', color: 'black', padding: '2px 15px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.8rem'}}>
              {currentQ.category.toUpperCase()}
            </div>
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
                <b style={{color: 'var(--gold)', marginRight: '10px'}}>{String.fromCharCode(65 + i)}:</b> 
                {opt}
              </button>
            ))}
          </div>
        </div>
        
        <div className="prize-card" style={{height: 'fit-content'}}>
          <h4 style={{textAlign: 'center', color: 'var(--gold)', margin: '0 0 15px 0', fontSize: '1rem'}}>VALOR PREGUNTA</h4>
          <div className="prize-list">
            {questions.map((q, i) => (
              <div 
                key={i} 
                className={`prize-row ${i === currentIdx ? 'active-prize' : ''} ${i < currentIdx ? 'passed-prize' : ''}`}
                style={{fontSize: '0.9rem', padding: '5px 15px'}}
              >
                <span>Q {i + 1}</span>
                <span style={{float: 'right'}}>${q.prize.toLocaleString()}</span>
              </div>
            )).reverse()}
          </div>
        </div>
      </div>

      {showResult && (
        <GameResult win={isWin} score={credits} playerName={playerName} onRestart={() => setView('menu')} />
      )}
    </div>
  );
};

export default Game;