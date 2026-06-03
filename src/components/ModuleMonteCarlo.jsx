import React, { useState } from 'react';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/format';
import { runMonteCarloAsync } from '../utils/montecarlo';
import DistributionInput from './DistributionInput';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

const ModuleMonteCarlo = () => {
  // --- Parámetros generales ---
  const [invInicial, setInvInicial] = useState(100000);
  const [plazo, setPlazo] = useState(5);
  const [simulaciones, setSimulaciones] = useState(10000);

  // --- TIO con distribución ---
  const [tioSpec, setTioSpec] = useState({ type: 'fixed', value: 10.0 });

  // --- Modo de flujos de caja ---
  const [flowMode, setFlowMode] = useState('base'); // 'base' | 'custom'

  // Base mode: un solo spec aplicado uniformemente
  const [baseFlowSpec, setBaseFlowSpec] = useState({ type: 'fixed', value: 25000 });

  // Custom mode: un spec por periodo
  const [customFlowSpecs, setCustomFlowSpecs] = useState([
    { type: 'fixed', value: 25000 },
    { type: 'fixed', value: 30000 },
    { type: 'fixed', value: 35000 },
    { type: 'fixed', value: 40000 },
    { type: 'fixed', value: 45000 },
  ]);

  // --- Resultados y Progreso ---
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  // Sincronizar customFlowSpecs cuando cambia el plazo
  const handlePlazoChange = (newPlazo) => {
    if (newPlazo === '') {
      setPlazo('');
      return;
    }
    const p = Math.max(1, Math.floor(newPlazo));
    setPlazo(p);
    setCustomFlowSpecs((prev) => {
      if (p > prev.length) {
        const lastSpec = prev[prev.length - 1] || { type: 'fixed', value: 25000 };
        return [...prev, ...Array(p - prev.length).fill({ ...lastSpec })];
      }
      return prev.slice(0, p);
    });
  };

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
        ? Array(plazo).fill(baseFlowSpec)
        : [...customFlowSpecs];

    setIsRunning(true);
    setResults(null);
    setProgress({ completed: 0, total: simulaciones });

    const res = await runMonteCarloAsync({
      initialInvestment: invInicial,
      cashFlowSpecs,
      discountRateSpec: tioSpec,
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

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{
          background: '#fff', border: '2px solid #000',
          padding: '0.6rem 1rem', fontFamily: 'Inter, sans-serif',
        }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            Rango de VPN:
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
      <h2>II. EVALUACIÓN DE PROYECTOS</h2>

      <h3>PARÁMETROS GENERALES</h3>
      <div className="grid grid-cols-3">
        <div>
          <div className="input-group">
            <label>Inversión Inicial ($)</label>
            <input type="number" value={invInicial} step={1000}
              onChange={(e) => setInvInicial(e.target.value === '' ? '' : parseFloat(e.target.value))} />
          </div>
        </div>
        <div>
          <div className="input-group">
            <label>Plazo del Proyecto (Años)</label>
            <input type="number" value={plazo} min={1}
              onChange={(e) => handlePlazoChange(e.target.value === '' ? '' : parseInt(e.target.value))} />
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

      {/* --- TIO con distribución --- */}
      <h3>TASA DE OPORTUNIDAD (TIO)</h3>
      <div style={{ maxWidth: '400px' }}>
        <DistributionInput
          label="TIO"
          unit="%"
          spec={tioSpec}
          onChange={setTioSpec}
          step={0.1}
        />
      </div>

      {/* --- Flujos de caja --- */}
      <h3>FLUJOS DE CAJA</h3>
      <div className="flow-mode-selector">
        <label className="radio-label" style={{ marginRight: '2rem' }}>
          <input type="radio" name="flowMode" value="base"
            checked={flowMode === 'base'}
            onChange={() => setFlowMode('base')} />
          <span className="radio-text">Flujo de Caja Base (uniforme)</span>
        </label>
        <label className="radio-label">
          <input type="radio" name="flowMode" value="custom"
            checked={flowMode === 'custom'}
            onChange={() => setFlowMode('custom')} />
          <span className="radio-text">Flujos de Caja por Periodo</span>
        </label>
      </div>

      {flowMode === 'base' ? (
        <div style={{ maxWidth: '400px', marginTop: '1rem' }}>
          <DistributionInput
            label="Flujo de Caja Base"
            unit="$"
            spec={baseFlowSpec}
            onChange={setBaseFlowSpec}
            step={500}
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
                  step={500}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="primary" onClick={handleCalculate}
        disabled={isRunning}
        style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        {isRunning ? 'SIMULANDO...' : 'EJECUTAR SIMULACIÓN'}
      </button>

      {/* --- Overlay de progreso --- */}
      {isRunning && (
        <div className="progress-overlay">
          <div className="progress-card">
            <div className="progress-title">EJECUTANDO SIMULACIÓN</div>
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
          <h3>RESULTADOS DE LA EVALUACIÓN</h3>

          <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
            <div className="metric-container highlight">
              <div className="metric-label">VPN Esperado (Promedio)</div>
              <div className="metric-value">{formatCurrency(results.expectedNPV, 2)}</div>
            </div>
            <div className="metric-container highlight">
              <div className="metric-label">TIR Esperada (Promedio)</div>
              <div className="metric-value">
                {isNaN(results.expectedIRR) ? 'N/D' : formatPercentage(results.expectedIRR, 2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className="metric-container">
              <div className="metric-label">Desviación Estándar</div>
              <div className="metric-value">{formatCurrency(results.stdDev, 2)}</div>
            </div>
            <div className="metric-container">
              <div className="metric-label">Probabilidad de Pérdida</div>
              <div className="metric-value">{formatPercentage(results.probLoss, 2)}</div>
            </div>
            <div className="metric-container">
              <div className="metric-label">Varianza del VPN</div>
              <div className="metric-value">{formatNumber(results.variance, 2)}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '2rem', textAlign: 'right', fontWeight: 600 }}>
            * Cálculos con precisión de punto flotante sobre {formatNumber(results.numSimulations, 0)} iteraciones.
          </div>

          <h3>DISTRIBUCIÓN DEL VPN (HISTOGRAMA)</h3>
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
                  label={{ value: 'VPN ($)', position: 'insideBottom', offset: -5, fill: '#000', fontWeight: 700 }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#000' }}
                  label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft', fill: '#000', fontWeight: 700 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={0} stroke="#000" strokeDasharray="4 4" strokeWidth={2} />
                <Bar dataKey="count" maxBarSize={50}>
                  {results.histogram.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isNegative ? '#000000' : '#002244'}
                      stroke="#000"
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
            <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#000', marginRight: 6, verticalAlign: 'middle', border: '1px solid #000' }}></span>VPN NEGATIVO (PÉRDIDA)</span>
            <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#002244', marginRight: 6, verticalAlign: 'middle', border: '1px solid #000' }}></span>VPN POSITIVO</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ModuleMonteCarlo;
