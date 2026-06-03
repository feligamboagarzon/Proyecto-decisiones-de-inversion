import React, { useState, useEffect } from 'react';
import { formatPercentage, formatCurrency } from '../utils/format';
import { calculateCAPM, calculateWACC } from '../utils/waccCapm';

const ModuleWaccCapm = () => {
  // CAPM State
  const [rf, setRf] = useState(5.0); // Tasa Libre de Riesgo (%)
  const [beta, setBeta] = useState(1.2); // Beta
  const [rm, setRm] = useState(10.0); // Retorno Mercado (%)
  const [countryRisk, setCountryRisk] = useState(0.0); // Riesgo País (%)
  const [ke, setKe] = useState(0); // Costo de Equity (Calculado)

  // WACC State
  const [equity, setEquity] = useState(1000000); // Valor Patrimonio (E)
  const [debt, setDebt] = useState(500000); // Valor Deuda (D)
  const [kd, setKd] = useState(7.0); // Costo de la Deuda (%)
  const [taxRate, setTaxRate] = useState(30.0); // Tasa de Impuestos (%)
  const [wacc, setWacc] = useState(0); // WACC (Calculado)

  // Real-time calculations
  useEffect(() => {
    // Calculamos CAPM
    const computedKe = calculateCAPM(rf / 100, beta, rm / 100, countryRisk / 100);
    setKe(computedKe);

    // Calculamos WACC
    const computedWacc = calculateWACC(
      equity,
      debt,
      computedKe, // Usamos el Ke calculado de CAPM
      kd / 100,
      taxRate / 100
    );
    setWacc(computedWacc);
  }, [rf, beta, rm, countryRisk, equity, debt, kd, taxRate]);

  return (
    <div className="module">
      <h2>IV. CALCULADORA WACC Y CAPM</h2>
      
      <div className="grid grid-cols-2">
        {/* Lado CAPM */}
        <div>
          <h3>1. MODELO CAPM (COSTO DE EQUITY - Ke)</h3>
          <div className="grid grid-cols-2">
            <div className="input-group">
              <label>Tasa Libre de Riesgo (Rf) %</label>
              <input
                type="number"
                step="0.01"
                value={rf}
                onChange={(e) => setRf(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label>Beta (β)</label>
              <input
                type="number"
                step="0.01"
                value={beta}
                onChange={(e) => setBeta(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label>Retorno del Mercado (Rm) %</label>
              <input
                type="number"
                step="0.01"
                value={rm}
                onChange={(e) => setRm(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label>Riesgo País (Opcional) %</label>
              <input
                type="number"
                step="0.01"
                value={countryRisk}
                onChange={(e) => setCountryRisk(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className="metric-container highlight" style={{ marginTop: '1.5rem' }}>
            <div className="metric-label">Costo de Patrimonio (Ke)</div>
            <div className="metric-value">{formatPercentage(ke, 7)}</div>
          </div>
        </div>

        {/* Lado WACC */}
        <div>
          <h3>2. CÁLCULO WACC</h3>
          <div className="grid grid-cols-2">
            <div className="input-group">
              <label>Valor Patrimonio (E) $</label>
              <input
                type="number"
                step="1000"
                value={equity}
                onChange={(e) => setEquity(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label>Valor Deuda (D) $</label>
              <input
                type="number"
                step="1000"
                value={debt}
                onChange={(e) => setDebt(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label>Costo de la Deuda (Kd) %</label>
              <input
                type="number"
                step="0.01"
                value={kd}
                onChange={(e) => setKd(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label>Tasa de Impuestos (T) %</label>
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="metric-container highlight" style={{ marginTop: '1.5rem' }}>
            <div className="metric-label">WACC (Costo Promedio Ponderado)</div>
            <div className="metric-value">{formatPercentage(wacc, 7)}</div>
          </div>
          
          {/* Métricas Adicionales WACC */}
          <div className="grid grid-cols-2" style={{ marginTop: '1rem', gap: '1rem' }}>
            <div className="metric-container" style={{ margin: 0 }}>
              <div className="metric-label">Peso Patrimonio (E/V)</div>
              <div className="metric-value">
                {formatPercentage(equity + debt > 0 ? equity / (equity + debt) : 0, 2)}
              </div>
            </div>
            <div className="metric-container" style={{ margin: 0 }}>
              <div className="metric-label">Peso Deuda (D/V)</div>
              <div className="metric-value">
                {formatPercentage(equity + debt > 0 ? debt / (equity + debt) : 0, 2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleWaccCapm;
