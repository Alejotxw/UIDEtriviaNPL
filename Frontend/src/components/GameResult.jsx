import React from 'react';

const GameResult = ({ win, score, playerName, onRestart }) => {
  return (
    <div className="result-overlay">
      <div className={`result-card ${win ? 'win-border' : 'lose-border'}`}>
        <h1 className="result-title">
          {win ? '¡FELICIDADES!' : 'FIN DEL JUEGO'}
        </h1>
        
        <div className="result-icon">
          {win ? '🏆' : '❌'}
        </div>

        <h2 className="result-status">
          {win ? '¡HAS GANADO EL PREMIO MAYOR!' : 'HAS PERDIDO'}
        </h2>

        <div className="final-score-box">
          <span>PUNTAJE FINAL</span>
          <h3>${score.toLocaleString()}</h3>
        </div>

        <p className="result-player">Jugador: {playerName}</p>

        <button className="btn-save-settings" onClick={onRestart}>
          VOLVER AL MENÚ
        </button>
      </div>
    </div>
  );
};

export default GameResult;