import '../css/titleBar.css';

const TitleBar = () => {
  return (
    <header className="titlebar">
      <span>Electro</span>

      <div className="window-controls">
        <button
          aria-label="Minimizar"
          onClick={() => window.windowControls.minimize()}
        >
          -
        </button>
        <button
          aria-label="Maximizar o restaurar"
          onClick={() => window.windowControls.toggleMaximize()}
        >
          □
        </button>
        <button
          aria-label="Cerrar"
          onClick={() => window.windowControls.close()}
        >
          x
        </button>
      </div>
    </header>
  );
};

export default TitleBar;
