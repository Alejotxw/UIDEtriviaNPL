import React from 'react';

const Scoreboard = ({ scores, setView }) => {
  return (
    <div className="settings-overlay"> {/* Reutilizamos el fondo oscuro */}
      <div className="scoreboard-card"> {/* Nuevo estilo de cuadro para la tabla */}
        <h2 className="settings-title">🏆 MEJORES PUNTUACIONES</h2>
        
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Jugador</th>
                <th>Puntaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {scores.length > 0 ? (
                scores.map((s, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{s.name}</td>
                    <td>${s.score.toLocaleString()}</td>
                    <td>{s.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay puntuaciones registradas aún.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button onClick={() => setView('menu')} className="btn-save-settings" style={{ marginTop: '20px' }}>
          VOLVER AL MENÚ
        </button>
      </div>
    </div>
  );
};

export default Scoreboard;