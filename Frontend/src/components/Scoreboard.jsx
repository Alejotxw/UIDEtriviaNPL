import React from 'react';

const Scoreboard = ({ setView }) => {
  // Obtenemos los puntajes de localStorage
  const scores = JSON.parse(localStorage.getItem('scores') || '[]');

  return (
    <div className="scoreboard-overlay">
      <div className="scoreboard-card">
        <h2 className="gold-text">🏆 SALÓN DE LA FAMA 🏆</h2>
        
        <div className="score-table-container">
          {scores.length > 0 ? (
            <table className="score-table">
              <thead>
                <tr>
                  <th>Puesto</th>
                  <th>Jugador</th>
                  <th>Puntaje</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, index) => (
                  <tr key={index} className={index === 0 ? 'top-score' : ''}>
                    <td>{index + 1}º</td>
                    <td>{s.name}</td>
                    <td className="gold-text">${s.score.toLocaleString()}</td>
                    <td style={{ fontSize: '0.8rem' }}>{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-scores">Aún no hay récords. ¡Sé el primero!</p>
          )}
        </div>

        <button className="menu-btn" onClick={() => setView('menu')}>
          VOLVER AL MENÚ
        </button>
      </div>
    </div>
  );
};

export default Scoreboard;