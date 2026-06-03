import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentModule, setCurrentModule }) => {
  const modules = [
    { id: 'rates', label: 'I. Conversión de Tasas' },
    { id: 'montecarlo', label: 'II. Evaluación de Proyectos' },
    { id: 'bonds', label: 'III. Valoración de Bonos' },
    { id: 'wacc', label: 'IV. Calculadora WACC y CAPM' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>PROYECTO DECISIONES DE INVERSIÓN</h1>
        <p className="subtitle"><strong>SISTEMA INSTITUCIONAL DE EVALUACIÓN DE INVERSIONES</strong></p>
      </div>

      <div className="sidebar-nav">
        <p className="nav-title">SELECCIONE UN MÓDULO:</p>
        <div className="radio-group">
          {modules.map(mod => (
            <label key={mod.id} className="radio-label">
              <input 
                type="radio" 
                name="module" 
                value={mod.id}
                checked={currentModule === mod.id}
                onChange={() => setCurrentModule(mod.id)}
              />
              <span className="radio-text">{mod.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <p className="caption">CORE v1.0.0 (Base Front-End)</p>
        <p className="caption">PRECISIÓN DE MOTOR: 7 DECIMALES</p>
      </div>
    </aside>
  );
};

export default Sidebar;
