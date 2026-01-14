import React from 'react';

const Settings = ({ setView, wildcardActive, setWildcardActive, difficultyTime, setDifficultyTime }) => {
  return (
    <div className="settings-overlay">
      <div className="settings-card">
        <h2 className="settings-title">⚙️ CONFIGURACIÓN</h2>
        
        <div className="settings-section">
          <h3>COMODINES</h3>
          <div className="option-box">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={wildcardActive} 
                // Actualiza el estado en App.jsx
                onChange={(e) => setWildcardActive(e.target.checked)} 
              />
              Activar Comodín de Llamada
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>TIEMPO POR PREGUNTA</h3>
          <select 
            className="settings-select"
            value={difficultyTime}
            // Actualiza el estado en App.jsx (convertimos a número)
            onChange={(e) => setDifficultyTime(Number(e.target.value))}
          >
            <option value={45}>Fácil (45 seg)</option>
            <option value={30}>Normal (30 seg)</option>
            <option value={15}>Difícil (15 seg)</option>
          </select>
        </div>

        <button onClick={() => setView('menu')} className="btn-save-settings">
          GUARDAR Y VOLVER
        </button>
      </div>
    </div>
  );
};

export default Settings;