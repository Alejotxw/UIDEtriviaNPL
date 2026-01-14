import React, { useState } from 'react';

const SetupPlayer = ({ setView, setPlayerName }) => {
  const [tempName, setTempName] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setPlayerName(tempName);
      setView('game');
    } else {
      alert("Por favor, ingresa un nombre");
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-card">
        <h2 className="settings-title">REGISTRO</h2>
        
        <form onSubmit={handleStart} className="setup-form">
          <div className="settings-section">
            <h3 style={{ textAlign: 'center' }}>¿CÓMO TE LLAMAS?</h3>
            <input 
              type="text" 
              placeholder="Ingresa tu nombre..." 
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="setup-input"
              autoFocus
            />
          </div>

          <div className="setup-actions">
            <button type="submit" className="btn-save-settings">
              EMPEZAR JUEGO
            </button>
            <button 
              type="button" 
              onClick={() => setView('menu')} 
              className="btn-back-link"
            >
              VOLVER AL MENÚ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupPlayer;