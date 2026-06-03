import React, { useState, useEffect } from 'react';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/format';
import { runBondsMonteCarloAsync } from '../utils/bondsMontecarlo';
import DistributionInput from './DistributionInput';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

const ModuleBonds = () => {
  // --- Parámetros Generales ---
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState(2);
  const [simulaciones, setSimulaciones] = useState(10000);

  // --- Distribuciones Globales ---
  const [faceValueSpec, setFaceValueSpec] = useState({ type: 'fixed', value: 1000 });
  const [ytmSpec, setYtmSpec] = useState({ type: 'fixed', value: 5.5 });

  // --- Flujos de Caja (Cupones) ---
  const [flowMode, setFlowMode] = useState('base'); // 'base' | 'custom'
  const [baseFlowSpec, setBaseFlowSpec] = useState({ type: 'fixed', value: 30 }); // 6% / 2 * 1000 = 30
  
  const numPeriods = Math.max(1, years * frequency);
  const [customFlowSpecs, setCustomFlowSpecs] = useState(
    Array(20).fill({ type: 'fixed', value: 30 })
  );

  // --- Resultados y Progreso ---
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  // Sincronizar customFlowSpecs cuando cambia el plazo o frecuencia
  useEffect(() => {
    setCustomFlowSpecs((prev) => {
      if (numPeriods > prev.length) {
        const lastSpec = prev[prev.length - 1] || { type: 'fixed', value: 30 };
        return [...prev, ...Array(numPeriods - prev.length).fill({ ...lastSpec })];
      }
      return prev.slice(0, numPeriods);
    });
  }, [numPeriods]);

  const handleCustomSpecChange = (index, newSpec) => {
    setCustomFlowSpecs((prev) => {
      const copy = [...prev];
      copy[index] = newSpec;
      return copy;
    });
  };

  const handleCalculate = async () => {
    const cashFlowSpecs =
      flowMode === 'base'
        ? Array(numPeriods).fill(baseFlowSpec)
        : [...customFlowSpecs];

    setIsRunning(true);
    setResults(null);
    setProgress({ completed: 0, total: simulaciones });

    const res = await runBondsMonteCarloAsync({
      faceValueSpec,
      cashFlowSpecs,
      ytmSpec,
      frequency,
      numSimulations: simulaciones,
      onProgress: (completed, total) => {
        setProgress({ completed, total });
      },
      batchSize: 500,
    });

    setResults(res);
    setIsRunning(false);
  };

  const progressPercent = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  // Custom tooltip for the histogram chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{
          background: '#fff', border: '2px solid #000',
          padding: '0.6rem 1rem', fontFamily: 'Inter, sans-serif',
        }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            Rango de Precio:
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', fontFamily: 'monospace' }}>
            {formatCurrency(d.binStart, 2)} a {formatCurrency(d.binEnd, 2)}
          </p>
          <p style={{ margin: '0.3rem 0 0 0', fontWeight: 600, fontSize: '0.85rem', color: '#666' }}>
            Frecuencia: {formatNumber(d.count, 0)} ({formatPercentage(d.frequency, 2)})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="module">
      <h2>III. VALORACIÓN Y RIESGO ESTOCÁSTICO DE BONOS (MONTE CARLO)</h2>

      <h3>PARÁMETROS GENERALES</h3>
      <div className="grid grid-cols-3">
        <div>
          <div className="input-group">
            <label>Plazo al Vencimiento (Años)</label>
            <input 
              type="number" 
              value={years} 
              min={1}
              onChange={(e) => setYears(e.target.value === '' ? '' : parseInt(e.target.value))} 
            />
          </div>
        </div>
        <div>
          <div className="input-group">
            <label>Frecuencia de Pago</label>
            <select 
              value={frequency}
              onChange={(e) => setFrequency(e.target.value === '' ? '' : parseInt(e.target.value))}
            >
              <option value="1">1 pago/año (Anual)</option>
              <option value="2">2 pagos/año (Semestral)</option>
              <option value="4">4 pagos/año (Trimestral)</option>
              <option value="12">12 pagos/año (Mensual)</option>
            </select>
          </div>
        </div>
        <div>
          <div className="input-group">
            <label>N° de Simulaciones</label>
            <input type="number" value={simulaciones} step={1000}
              onChange={(e) => setSimulaciones(e.target.value === '' ? '' : parseInt(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div>
          <h3>VALOR NOMINAL DEL BONO</h3>
          <DistributionInput
            label="Valor Nominal"
            unit="$"
            spec={faceValueSpec}
            onChange={setFaceValueSpec}
            step={100}
          />
        </div>
        <div>
          <h3>RENDIMIENTO (YTM)</h3>
          <DistributionInput
            label="Rendimiento YTM"
            unit="%"
            spec={ytmSpec}
            onChange={setYtmSpec}
            step={0.1}
          />
        </div>
      </div>

      {/* --- Flujos de caja (Cupones) --- */}
      <h3>FLUJOS DE CAJA (CUPONES)</h3>
      <div className="flow-mode-selector">
        <label className="radio-label" style={{ marginRight: '2rem' }}>
          <input type="radio" name="flowMode" value="base"
            checked={flowMode === 'base'}
            onChange={() => setFlowMode('base')} />
          <span className="radio-text">Cupón Base (Uniforme)</span>
        </label>
        <label className="radio-label">
          <input type="radio" name="flowMode" value="custom"
            checked={flowMode === 'custom'}
            onChange={() => setFlowMode('custom')} />
          <span className="radio-text">Cupones por Periodo</span>
        </label>
      </div>

      {flowMode === 'base' ? (
        <div style={{ maxWidth: '400px', marginTop: '1rem' }}>
          <DistributionInput
            label="Monto del Cupón"
            unit="$"
            spec={baseFlowSpec}
            onChange={setBaseFlowSpec}
            step={5}
          />
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <div className="custom-flows-grid">
            {customFlowSpecs.map((spec, i) => (
              <div key={i} className="custom-flow-item">
                <DistributionInput
                  label={`Periodo ${i + 1}`}
                  unit="$"
                  spec={spec}
                  onChange={(newSpec) => handleCustomSpecChange(i, newSpec)}
                  step={5}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="primary" onClick={handleCalculate}
        disabled={isRunning}
        style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        {isRunning ? 'SIMULANDO...' : 'EJECUTAR SIMULACIÓN DE BONO'}
      </button>

      {/* --- Overlay de progreso --- */}
      {isRunning && (
        <div className="progress-overlay">
          <div className="progress-card">
            <div className="progress-title">SIMULANDO PRECIO DEL BONO</div>
            <div className="progress-counter">
              <span className="progress-current">{formatNumber(progress.completed, 0)}</span>
              <span className="progress-separator"> / </span>
              <span className="progress-total">{formatNumber(progress.total, 0)}</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="progress-percent">{progressPercent}%</div>
          </div>
        </div>
      )}

      {/* --- Resultados --- */}
      {results && !isRunning && (
        <>
          <h3>RESULTADOS ESTOCÁSTICOS</h3>

          <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
            <div className="metric-container highlight" style={{ marginBottom: 0 }}>
              <div className="metric-label">Precio Limpio Esperado</div>
              <div className="metric-value">{formatCurrency(results.expectedPrice, 4)}</div>
            </div>
            <div className="metric-container" style={{ marginBottom: 0 }}>
              <div className="metric-label">Desviación Estándar (Precio)</div>
              <div className="metric-value">{formatCurrency(results.stdDevPrice, 4)}</div>
            </div>
          </div>

          <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
            <div className="metric-container">
              <div className="metric-label">Duration Macaulay Esperada</div>
              <div className="metric-value">{formatNumber(results.expectedMac, 4)}</div>
            </div>
            <div className="metric-container">
              <div className="metric-label">Duration Modificada Esperada</div>
              <div className="metric-value">{formatNumber(results.expectedMod, 4)}</div>
            </div>
            <div className="metric-container">
              <div className="metric-label">Convexidad Esperada</div>
              <div className="metric-value">{formatNumber(results.expectedConvexity, 4)}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '2rem', textAlign: 'right', fontWeight: 600 }}>
            * Cálculos estocásticos sobre {formatNumber(results.numSimulations, 0)} iteraciones.
          </div>

          <h3>DISTRIBUCIÓN DE PROBABILIDAD DEL PRECIO</h3>
          <div style={{ width: '100%', height: 400, border: '2px solid #000', background: '#fcfcfc' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.histogram} margin={{ top: 20, right: 30, left: 25, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis
                  dataKey="rangeLabel"
                  tick={{ fontSize: 11, fill: '#000' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  label={{ value: 'Precio Limpio ($)', position: 'insideBottom', offset: -5, fill: '#000', fontWeight: 700 }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#000' }}
                  label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft', fill: '#000', fontWeight: 700 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#002244" stroke="#000" strokeWidth={1} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default ModuleBonds;
