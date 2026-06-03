import React, { useState } from 'react';
import './DistributionInput.css';

/**
 * DistributionInput — Componente reutilizable para entradas numéricas que pueden
 * ser un valor fijo o una de 5 distribuciones de probabilidad comunes.
 *
 * Distribuciones soportadas:
 *   - fixed: Valor fijo (determinista)
 *   - normal: Distribución Normal (μ, σ)
 *   - uniform: Distribución Uniforme [mín, máx]
 *   - triangular: Distribución Triangular (mín, moda, máx)
 *   - lognormal: Distribución Lognormal (media, desv. estándar)
 *   - exponential: Distribución Exponencial (media)
 */
const DistributionInput = ({ label, spec, onChange, step = 1, unit = '' }) => {
  const [expanded, setExpanded] = useState(false);

  const handleTypeChange = (newType) => {
    // Tomamos un valor de base para inicializar los parámetros
    const baseValue = spec.value ?? spec.mean ?? spec.mode ?? spec.min ?? 0;

    switch (newType) {
      case 'fixed':
        onChange({ type: 'fixed', value: baseValue });
        break;
      case 'normal':
        onChange({
          type: 'normal',
          mean: baseValue,
          stdDev: spec.stdDev ?? Math.max(1, Math.abs(baseValue * 0.1)),
        });
        break;
      case 'uniform':
        onChange({
          type: 'uniform',
          min: baseValue * 0.9,
          max: baseValue * 1.1 || 100,
        });
        break;
      case 'triangular':
        onChange({
          type: 'triangular',
          min: baseValue * 0.8,
          mode: baseValue,
          max: baseValue * 1.2 || 100,
        });
        break;
      case 'lognormal':
        onChange({
          type: 'lognormal',
          mean: Math.max(0.01, baseValue),
          stdDev: spec.stdDev ?? Math.max(1, Math.abs(baseValue * 0.1)),
        });
        break;
      case 'exponential':
        onChange({
          type: 'exponential',
          mean: Math.max(0.01, baseValue),
        });
        break;
      default:
        break;
    }
  };

  const isFixed = spec.type === 'fixed';

  // Renderiza el resumen de los parámetros cuando está colapsado
  const renderSummary = () => {
    switch (spec.type) {
      case 'normal':
        return (
          <div className="dist-input__summary">
            <span className="dist-input__badge">NORMAL</span>
            <span>μ: {spec.mean?.toLocaleString('en-US')} · σ: {spec.stdDev?.toLocaleString('en-US')}</span>
          </div>
        );
      case 'uniform':
        return (
          <div className="dist-input__summary">
            <span className="dist-input__badge">UNIFORME</span>
            <span>Mín: {spec.min?.toLocaleString('en-US')} · Máx: {spec.max?.toLocaleString('en-US')}</span>
          </div>
        );
      case 'triangular':
        return (
          <div className="dist-input__summary">
            <span className="dist-input__badge">TRIANGULAR</span>
            <span>Mín: {spec.min?.toLocaleString('en-US')} · Moda: {spec.mode?.toLocaleString('en-US')} · Máx: {spec.max?.toLocaleString('en-US')}</span>
          </div>
        );
      case 'lognormal':
        return (
          <div className="dist-input__summary">
            <span className="dist-input__badge">LOGNORMAL</span>
            <span>μ: {spec.mean?.toLocaleString('en-US')} · σ: {spec.stdDev?.toLocaleString('en-US')}</span>
          </div>
        );
      case 'exponential':
        return (
          <div className="dist-input__summary">
            <span className="dist-input__badge">EXPONENCIAL</span>
            <span>Media: {spec.mean?.toLocaleString('en-US')}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dist-input">
      <div className="dist-input__header">
        <label className="dist-input__label">
          {label} {unit && <span className="dist-input__unit">({unit})</span>}
        </label>
        <button
          type="button"
          className={`dist-input__toggle ${expanded ? 'dist-input__toggle--open' : ''}`}
          onClick={() => setExpanded(!expanded)}
          title="Configurar distribución"
        >
          ▾
        </button>
      </div>

      {/* Vista colapsada */}
      {!expanded && (
        <div className="dist-input__compact">
          {isFixed ? (
            <input
              type="number"
              value={spec.value}
              step={step}
              onChange={(e) => onChange({ ...spec, value: e.target.value === '' ? '' : parseFloat(e.target.value) })}
            />
          ) : (
            renderSummary()
          )}
        </div>
      )}

      {/* Panel expandido */}
      {expanded && (
        <div className="dist-input__panel">
          <div className="dist-input__type-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Distribución</label>
            <select
              value={spec.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{ padding: '0.4rem', border: '2px solid var(--color-border)' }}
            >
              <option value="fixed">Valor Fijo (Determinista)</option>
              <option value="normal">Distribución Normal</option>
              <option value="uniform">Distribución Uniforme</option>
              <option value="triangular">Distribución Triangular</option>
              <option value="lognormal">Distribución Lognormal</option>
              <option value="exponential">Distribución Exponencial</option>
            </select>
          </div>

          <div style={{ marginTop: '0.8rem' }}>
            {isFixed && (
              <div className="dist-input__fields">
                <div className="dist-input__field">
                  <label>Valor</label>
                  <input
                    type="number"
                    value={spec.value}
                    step={step}
                    onChange={(e) => onChange({ ...spec, value: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {spec.type === 'normal' && (
              <div className="dist-input__fields">
                <div className="dist-input__field">
                  <label>Media (μ)</label>
                  <input
                    type="number"
                    value={spec.mean}
                    step={step}
                    onChange={(e) => onChange({ ...spec, mean: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
                <div className="dist-input__field">
                  <label>Desv. Estándar (σ)</label>
                  <input
                    type="number"
                    value={spec.stdDev}
                    step={step}
                    onChange={(e) => onChange({ ...spec, stdDev: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {spec.type === 'uniform' && (
              <div className="dist-input__fields">
                <div className="dist-input__field">
                  <label>Mínimo</label>
                  <input
                    type="number"
                    value={spec.min}
                    step={step}
                    onChange={(e) => onChange({ ...spec, min: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
                <div className="dist-input__field">
                  <label>Máximo</label>
                  <input
                    type="number"
                    value={spec.max}
                    step={step}
                    onChange={(e) => onChange({ ...spec, max: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {spec.type === 'triangular' && (
              <div className="dist-input__fields" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="dist-input__field">
                    <label>Mínimo</label>
                    <input
                      type="number"
                      value={spec.min}
                      step={step}
                      onChange={(e) => onChange({ ...spec, min: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="dist-input__field">
                    <label>Máximo</label>
                    <input
                      type="number"
                      value={spec.max}
                      step={step}
                      onChange={(e) => onChange({ ...spec, max: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="dist-input__field">
                  <label>Moda / Más probable</label>
                  <input
                    type="number"
                    value={spec.mode}
                    step={step}
                    onChange={(e) => onChange({ ...spec, mode: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {spec.type === 'lognormal' && (
              <div className="dist-input__fields">
                <div className="dist-input__field">
                  <label>Media aritmética (μ)</label>
                  <input
                    type="number"
                    value={spec.mean}
                    step={step}
                    onChange={(e) => onChange({ ...spec, mean: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
                <div className="dist-input__field">
                  <label>Desv. Estándar (σ)</label>
                  <input
                    type="number"
                    value={spec.stdDev}
                    step={step}
                    onChange={(e) => onChange({ ...spec, stdDev: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {spec.type === 'exponential' && (
              <div className="dist-input__fields">
                <div className="dist-input__field">
                  <label>Media (1/λ)</label>
                  <input
                    type="number"
                    value={spec.mean}
                    step={step}
                    onChange={(e) => onChange({ ...spec, mean: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionInput;
