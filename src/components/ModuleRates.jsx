import React, { useState, useMemo } from 'react';
import { formatPercentage } from '../utils/format';
import { convertToEA, generateEquivalentRatesMatrix, calculateRealRate, calculateForeignCurrencyRate } from '../utils/rates';

const ModuleRates = () => {
  // Input states
  const [inputValue, setInputValue] = useState(10); // 10%
  const [rateType, setRateType] = useState('effective'); // 'effective', 'nominal', 'periodic'
  const [periods, setPeriods] = useState(12); // Default to Mensual (12)
  const [modality, setModality] = useState('vencida'); // 'vencida', 'anticipada'

  // Factores macroeconómicos
  const [inflation, setInflation] = useState(0); // 0%
  const [devaluation, setDevaluation] = useState(0); // 0%

  // Opciones de capitalización
  const periodOptions = [
    { value: 1, label: 'Anual (1)' },
    { value: 2, label: 'Semestral (2)' },
    { value: 4, label: 'Trimestral (4)' },
    { value: 6, label: 'Bimestral (6)' },
    { value: 12, label: 'Mensual (12)' },
    { value: 24, label: 'Quincenal (24)' },
    { value: 360, label: 'Diaria (360)' }
  ];

  // Cálculo en tiempo real usando useMemo
  const results = useMemo(() => {
    const decimalRate = inputValue / 100;
    const ea = convertToEA(decimalRate, rateType, periods, modality);
    
    if (isNaN(ea) || !isFinite(ea)) {
      return null; // Error or invalid input
    }

    const matrix = generateEquivalentRatesMatrix(ea);
    
    const decimalInflation = inflation / 100;
    const decimalDevaluation = devaluation / 100;

    const realRate = calculateRealRate(ea, decimalInflation);
    const foreignRate = calculateForeignCurrencyRate(ea, decimalDevaluation);
    const realForeignRate = calculateRealRate(foreignRate, decimalInflation);
    
    return {
      ea,
      matrix,
      realRate,
      foreignRate,
      realForeignRate
    };
  }, [inputValue, rateType, periods, modality, inflation, devaluation]);

  return (
    <div className="module">
      <h2>I. CONVERSIÓN DE TASAS DE INTERÉS</h2>
      
      <h3>TASA DE ORIGEN</h3>
      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="input-group">
            <label>Valor de la Tasa (%)</label>
            <input 
              type="number" 
              value={inputValue} 
              step={0.1}
              onChange={(e) => setInputValue(e.target.value === '' ? '' : parseFloat(e.target.value))} 
            />
          </div>
          <div className="input-group">
            <label>Tipo de Tasa</label>
            <select value={rateType} onChange={(e) => setRateType(e.target.value)}>
              <option value="effective">Efectiva Anual (EA)</option>
              <option value="nominal">Nominal Anual</option>
              <option value="periodic">Periódica</option>
            </select>
          </div>
        </div>
        <div>
          <div className="input-group">
            <label>Capitalización</label>
            <select 
              value={periods} 
              onChange={(e) => setPeriods(parseInt(e.target.value))}
              disabled={rateType === 'effective'}
              style={{ opacity: rateType === 'effective' ? 0.5 : 1 }}
            >
              {periodOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Modalidad</label>
            <select 
              value={modality} 
              onChange={(e) => setModality(e.target.value)}
              disabled={rateType === 'effective'}
              style={{ opacity: rateType === 'effective' ? 0.5 : 1 }}
            >
              <option value="vencida">Vencida</option>
              <option value="anticipada">Anticipada</option>
            </select>
          </div>
        </div>
      </div>

      <h3>FACTORES MACROECONÓMICOS (Opcional)</h3>
      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="input-group">
            <label>Inflación Esperada (EA %)</label>
            <input 
              type="number" 
              value={inflation} 
              step={0.1}
              onChange={(e) => setInflation(e.target.value === '' ? '' : parseFloat(e.target.value))} 
            />
          </div>
        </div>
        <div>
          <div className="input-group">
            <label>Devaluación Esperada (EA %)</label>
            <input 
              type="number" 
              value={devaluation} 
              step={0.1}
              onChange={(e) => setDevaluation(e.target.value === '' ? '' : parseFloat(e.target.value))} 
            />
          </div>
        </div>
      </div>

      <h3>MATRIZ DE TASAS EQUIVALENTES</h3>
      {results ? (
        <>
          <div className="metric-container highlight" style={{ marginBottom: '2rem' }}>
            <div className="metric-label">TASA EFECTIVA ANUAL (EA) BASE</div>
            <div className="metric-value">{formatPercentage(results.ea, 4)}</div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <div className="flows-table" style={{ maxWidth: '100%' }}>
              {/* Encabezado */}
              <div className="flows-header" style={{ gridTemplateColumns: '150px repeat(4, 1fr)' }}>
                <div className="flows-cell flows-cell--header">Capitalización</div>
                <div className="flows-cell flows-cell--header" style={{ textAlign: 'center' }}>Periódica Vencida</div>
                <div className="flows-cell flows-cell--header" style={{ textAlign: 'center' }}>Periódica Anticipada</div>
                <div className="flows-cell flows-cell--header" style={{ textAlign: 'center' }}>Nominal Vencida</div>
                <div className="flows-cell flows-cell--header" style={{ textAlign: 'center' }}>Nominal Anticipada</div>
              </div>

              {/* Filas */}
              {results.matrix.map((row, idx) => (
                <div key={idx} className="flows-row" style={{ gridTemplateColumns: '150px repeat(4, 1fr)' }}>
                  <div className="flows-cell">{row.label} ({row.periods})</div>
                  <div className="flows-cell" style={{ justifyContent: 'flex-end', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    {formatPercentage(row.periodicVencida, 4)}
                  </div>
                  <div className="flows-cell" style={{ justifyContent: 'flex-end', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    {formatPercentage(row.periodicAnticipada, 4)}
                  </div>
                  <div className="flows-cell" style={{ justifyContent: 'flex-end', fontFamily: 'monospace', fontSize: '1.1rem', backgroundColor: '#f9f9f9' }}>
                    {formatPercentage(row.nominalVencida, 4)}
                  </div>
                  <div className="flows-cell" style={{ justifyContent: 'flex-end', fontFamily: 'monospace', fontSize: '1.1rem', backgroundColor: '#f9f9f9' }}>
                    {formatPercentage(row.nominalAnticipada, 4)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>EFECTO MACROECONÓMICO SOBRE LA TASA EA</h3>
          <div className="grid grid-cols-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div className="metric-container" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <div className="metric-label" style={{ color: 'var(--color-text)' }}>TASA REAL (Sin Inflación)</div>
              <div className="metric-value" style={{ color: 'var(--color-primary)' }}>{formatPercentage(results.realRate, 4)}</div>
            </div>
            <div className="metric-container" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <div className="metric-label" style={{ color: 'var(--color-text)' }}>TASA EN USD (Sin Devaluación)</div>
              <div className="metric-value" style={{ color: 'var(--color-primary)' }}>{formatPercentage(results.foreignRate, 4)}</div>
            </div>
            <div className="metric-container" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <div className="metric-label" style={{ color: 'var(--color-text)' }}>TASA REAL EN USD</div>
              <div className="metric-value" style={{ color: 'var(--color-primary)' }}>{formatPercentage(results.realForeignRate, 4)}</div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', textAlign: 'right', fontWeight: 600 }}>
            * Cálculos mostrados con 4 decimales de precisión.
          </div>
        </>
      ) : (
        <div className="chart-placeholder">
          ERROR: LA TASA INGRESADA PRODUCE UN VALOR MATEMÁTICAMENTE INDETERMINADO O INFINITO.
        </div>
      )}
    </div>
  );
};

export default ModuleRates;
