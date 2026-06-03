import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ModuleRates from './components/ModuleRates';
import ModuleMonteCarlo from './components/ModuleMonteCarlo';

import ModuleBonds from './components/ModuleBonds';
import ModuleWaccCapm from './components/ModuleWaccCapm';
function App() {
  const [currentModule, setCurrentModule] = useState('rates');

  const renderModule = () => {
    switch(currentModule) {
      case 'rates':
        return <ModuleRates />;
      case 'montecarlo':
        return <ModuleMonteCarlo />;

      case 'bonds':
        return <ModuleBonds />;
      case 'wacc':
        return <ModuleWaccCapm />;
      default:
        return <ModuleRates />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentModule={currentModule} setCurrentModule={setCurrentModule} />
      <main className="main-content">
        {renderModule()}
      </main>
      <div className="creator-footer">
        Creado por Felipe Gamboa Garzon
      </div>
    </div>
  );
}

export default App;
