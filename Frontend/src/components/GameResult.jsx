import React from 'react';

const GameResult = ({ win, score, playerName, onRestart }) => {
  return (
    <div className="settings-overlay">
      <div className="settings-card result-card">
        <h2 className="settings-title">{win ? '¡FANTÁSTICO!' : 'FIN DEL JUEGO'}</h2>
        
        <div className="result-content">
          <div className="result-icon">{win ? '🏆' : '💸'}</div>
          <p className="result-text">
            {win 
              ? `¡Increíble ${playerName}! Has demostrado ser un genio.` 
              : `Buen intento ${playerName}, pero esta vez no pudo ser.`}
          </p>
          
          <div className="final-score-box">
            <span>PREMIO FINAL:</span>
            <h3>${score.toLocaleString()}</h3>
          </div>
        </div>

        <button onClick={onRestart} className="btn-save-settings">
          VOLVER AL INICIO
        </button>
      </div>
    </div>
  );
};

export default GameResult;