import React from 'react';
import logoWond from '../assets/logo-wond.png';

const MainMenu = ({ setView }) => {
  return (
    <div className="menu-container">
      {/* 1. Logo */}
      <div className="logo-wrapper">
        <img src={logoWond} alt="WOND Logo" className="logo-main" />
      </div>

      {/* 2. Botón de Play Superior */}
      <div className="play-only-container">
        <button className="btn-play" onClick={() => setView('setup')}>
          <div className="play-icon"></div>
        </button>
      </div>

      {/* 3. Fila Inferior (Ajustes + Texto + Copa) */}
      <div className="bottom-row-controls">
        <button className="btn-circle" onClick={() => setView('settings')}>
          <span role="img" aria-label="settings">⚙️</span>
        </button>

        <div className="label-play-main">DA CLICK PARA JUGAR</div>

        <button className="btn-circle" onClick={() => setView('scores')}>
          <span role="img" aria-label="trophy">🏆</span>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;