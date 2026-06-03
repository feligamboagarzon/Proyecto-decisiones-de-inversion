/**
 * Motor de Simulación Monte Carlo para evaluación de proyectos de inversión.
 *
 * Genera N simulaciones del VPN de un proyecto, donde cada variable de entrada
 * puede ser un valor fijo o una variable aleatoria con una de las 5 distribuciones.
 *
 * Distribuciones soportadas:
 *   - 'fixed': Valor determinista.
 *   - 'normal': Distribución Normal (μ, σ).
 *   - 'uniform': Distribución Uniforme [mín, máx].
 *   - 'triangular': Distribución Triangular (mín, moda, máx).
 *   - 'lognormal': Distribución Lognormal (media, desv. estándar).
 *   - 'exponential': Distribución Exponencial (media).
 */

/**
 * Genera un número aleatorio con distribución normal (media 0, desv. estándar 1)
 * usando el método Box-Muller.
 */
export function boxMullerRandom() {
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Muestrea un valor de una especificación de distribución.
 * @param {object} spec - { type, value?, mean?, stdDev?, min?, max?, mode? }
 * @returns {number}
 */
export function sampleFromSpec(spec) {
  if (!spec || spec.type === 'fixed') {
    return spec?.value ?? 0;
  }

  const u = Math.random();

  switch (spec.type) {
    case 'normal': {
      const mean = spec.mean ?? 0;
      const stdDev = spec.stdDev ?? 1;
      return mean + stdDev * boxMullerRandom();
    }
    case 'uniform': {
      const min = spec.min ?? 0;
      const max = spec.max ?? 1;
      return min + (max - min) * u;
    }
    case 'triangular': {
      const a = spec.min ?? 0;
      const b = spec.max ?? 1;
      const c = spec.mode ?? 0.5;
      if (b - a === 0) return a;
      if (u < (c - a) / (b - a)) {
        return a + Math.sqrt(u * (b - a) * (c - a));
      } else {
        return b - Math.sqrt((1 - u) * (b - a) * (b - c));
      }
    }
    case 'lognormal': {
      const m = spec.mean ?? 1;
      const v = spec.stdDev ?? 0;
      if (m <= 0) return 0; // Evitar indeterminaciones de log
      const m2 = m * m;
      const v2 = v * v;
      // Parámetros de la normal subyacente (μ_log, σ_log)
      // para que la variable lognormal final tenga la media (m) y varianza (v2) especificadas.
      const sigma2 = Math.log(1 + v2 / m2);
      const sigma = Math.sqrt(sigma2);
      const mu = Math.log(m2 / Math.sqrt(v2 + m2));
      const z = boxMullerRandom();
      return Math.exp(mu + sigma * z);
    }
    case 'exponential': {
      const mean = spec.mean ?? 1;
      if (mean <= 0) return 0;
      // Muestreo por transformación inversa
      return -Math.log(1 - u) * mean;
    }
    default:
      return spec?.value ?? 0;
  }
}

/**
 * Calcula el Valor Presente Neto dados flujos de caja y una tasa de descuento.
 * @param {number} initialInvestment - Inversión inicial (valor positivo, se resta).
 * @param {number[]} cashFlows - Array de flujos de caja por periodo.
 * @param {number} discountRate - Tasa de descuento decimal (ej. 0.10 para 10%).
 * @returns {number}
 */
function calculateNPV(initialInvestment, cashFlows, discountRate) {
  let npv = -initialInvestment;
  for (let t = 0; t < cashFlows.length; t++) {
    npv += cashFlows[t] / Math.pow(1 + discountRate, t + 1);
  }
  return npv;
}

/**
 * Aproxima la TIR (Tasa Interna de Retorno) usando el método de bisección.
 * @param {number} initialInvestment
 * @param {number[]} cashFlows
 * @returns {number} TIR como decimal, o NaN si no converge.
 */
function calculateIRR(initialInvestment, cashFlows) {
  let low = -0.99;
  let high = 5.0;
  const maxIter = 100;
  const tolerance = 1e-9;

  for (let i = 0; i < maxIter; i++) {
    const mid = (low + high) / 2;
    const npv = calculateNPV(initialInvestment, cashFlows, mid);
    if (Math.abs(npv) < tolerance) return mid;
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

/**
 * Ejecuta la simulación Monte Carlo completa.
 *
 * @param {object} params
 * @param {number}   params.initialInvestment - Inversión inicial (fija).
 * @param {object[]} params.cashFlowSpecs     - Array de specs de distribución por periodo.
 * @param {object}   params.discountRateSpec  - Spec de distribución de la TIO (en %).
 * @param {number}   params.numSimulations    - Cantidad de simulaciones.
 *
 * @returns {object} Resultados
 */
export function runMonteCarloSimulation({
  initialInvestment,
  cashFlowSpecs,
  discountRateSpec,
  numSimulations,
}) {
  const npvArray = [];
  const irrArray = [];

  for (let sim = 0; sim < numSimulations; sim++) {
    // Muestrear la tasa de descuento (TIO) y convertir a decimal
    const discountRatePercent = sampleFromSpec(discountRateSpec);
    const discountRate = discountRatePercent / 100;

    // Muestrear cada flujo de caja desde su distribución
    const sampledFlows = cashFlowSpecs.map((spec) => sampleFromSpec(spec));

    const npv = calculateNPV(initialInvestment, sampledFlows, discountRate);
    npvArray.push(npv);

    // Calcular TIR de esta iteración
    const irr = calculateIRR(initialInvestment, sampledFlows);
    if (isFinite(irr) && !isNaN(irr)) {
      irrArray.push(irr);
    }
  }

  // Estadísticas descriptivas del VPN
  const n = npvArray.length;
  const expectedNPV = npvArray.reduce((a, b) => a + b, 0) / n;
  const variance =
    npvArray.reduce((acc, v) => acc + Math.pow(v - expectedNPV, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Probabilidad de pérdida = P(VPN < 0)
  const lossCount = npvArray.filter((v) => v < 0).length;
  const probLoss = lossCount / n;

  // TIR Esperada
  const expectedIRR =
    irrArray.length > 0
      ? irrArray.reduce((a, b) => a + b, 0) / irrArray.length
      : NaN;

  // Construir histograma (30 bins)
  const numBins = 30;
  const minNPV = Math.min(...npvArray);
  const maxNPV = Math.max(...npvArray);
  const binWidth = (maxNPV - minNPV) / numBins || 1;

  const histogram = Array.from({ length: numBins }, (_, i) => {
    const binStart = minNPV + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = npvArray.filter(
      (v) => v >= binStart && (i === numBins - 1 ? v <= binEnd : v < binEnd)
    ).length;
    return {
      range: `${binStart.toFixed(0)}`,
      rangeLabel: `${(binStart / 1000).toFixed(1)}k`,
      binStart,
      binEnd,
      count,
      frequency: count / n,
      isNegative: binEnd <= 0,
    };
  });

  return {
    npvArray,
    expectedNPV,
    variance,
    stdDev,
    probLoss,
    expectedIRR,
    histogram,
    numSimulations: n,
  };
}

/**
 * Calcula las estadísticas finales a partir de arrays de VPN y TIR.
 * Extraída para reutilización entre la versión síncrona y asíncrona.
 */
function computeResults(npvArray, irrArray) {
  const n = npvArray.length;
  const expectedNPV = npvArray.reduce((a, b) => a + b, 0) / n;
  const variance =
    npvArray.reduce((acc, v) => acc + Math.pow(v - expectedNPV, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  const lossCount = npvArray.filter((v) => v < 0).length;
  const probLoss = lossCount / n;

  const expectedIRR =
    irrArray.length > 0
      ? irrArray.reduce((a, b) => a + b, 0) / irrArray.length
      : NaN;

  const numBins = 30;
  const minNPV = Math.min(...npvArray);
  const maxNPV = Math.max(...npvArray);
  const binWidth = (maxNPV - minNPV) / numBins || 1;

  const histogram = Array.from({ length: numBins }, (_, i) => {
    const binStart = minNPV + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = npvArray.filter(
      (v) => v >= binStart && (i === numBins - 1 ? v <= binEnd : v < binEnd)
    ).length;
    return {
      range: `${binStart.toFixed(0)}`,
      rangeLabel: `${(binStart / 1000).toFixed(1)}k`,
      binStart,
      binEnd,
      count,
      frequency: count / n,
      isNegative: binEnd <= 0,
    };
  });

  return {
    npvArray,
    expectedNPV,
    variance,
    stdDev,
    probLoss,
    expectedIRR,
    histogram,
    numSimulations: n,
  };
}

/**
 * Versión asíncrona de la simulación Monte Carlo que reporta progreso.
 * Ejecuta las iteraciones en lotes (batches), cediendo el hilo principal
 * entre cada lote para permitir que la UI se actualice.
 *
 * @param {object}   params           - Mismos parámetros que runMonteCarloSimulation.
 * @param {function} onProgress       - Callback: (completadas, total) => void
 * @param {number}   batchSize        - Iteraciones por lote (defecto: 500).
 * @returns {Promise<object>}         - Resultados finales.
 */
export function runMonteCarloAsync({
  initialInvestment,
  cashFlowSpecs,
  discountRateSpec,
  numSimulations,
  onProgress = () => {},
  batchSize = 500,
}) {
  return new Promise((resolve) => {
    const npvArray = [];
    const irrArray = [];
    let completed = 0;

    function runBatch() {
      const end = Math.min(completed + batchSize, numSimulations);

      for (let sim = completed; sim < end; sim++) {
        const discountRatePercent = sampleFromSpec(discountRateSpec);
        const discountRate = discountRatePercent / 100;
        const sampledFlows = cashFlowSpecs.map((spec) => sampleFromSpec(spec));

        const npv = calculateNPV(initialInvestment, sampledFlows, discountRate);
        npvArray.push(npv);

        const irr = calculateIRR(initialInvestment, sampledFlows);
        if (isFinite(irr) && !isNaN(irr)) {
          irrArray.push(irr);
        }
      }

      completed = end;
      onProgress(completed, numSimulations);

      if (completed < numSimulations) {
        // Ceder control al hilo principal para actualizar la UI
        setTimeout(runBatch, 0);
      } else {
        // Simulación completa — calcular estadísticas finales
        resolve(computeResults(npvArray, irrArray));
      }
    }

    // Arrancar primer lote
    onProgress(0, numSimulations);
    setTimeout(runBatch, 0);
  });
}

