import { sampleFromSpec } from './montecarlo';
import { 
  calculateBondPrice, 
  calculateMacaulayDuration, 
  calculateModifiedDuration, 
  calculateConvexity 
} from './bonds';

/**
 * Calcula estadísticas finales para la simulación Monte Carlo de Bonos.
 */
function computeBondResults(priceArray, macDurationArray, modDurationArray, convexityArray) {
  const n = priceArray.length;
  
  const expectedPrice = priceArray.reduce((a, b) => a + b, 0) / n;
  const variancePrice = priceArray.reduce((acc, v) => acc + Math.pow(v - expectedPrice, 2), 0) / n;
  const stdDevPrice = Math.sqrt(variancePrice);

  const expectedMac = macDurationArray.reduce((a, b) => a + b, 0) / n;
  const expectedMod = modDurationArray.reduce((a, b) => a + b, 0) / n;
  const expectedConvexity = convexityArray.reduce((a, b) => a + b, 0) / n;

  // Construir histograma del precio (30 bins)
  const numBins = 30;
  const minPrice = Math.min(...priceArray);
  const maxPrice = Math.max(...priceArray);
  const binWidth = (maxPrice - minPrice) / numBins || 1;

  const histogram = Array.from({ length: numBins }, (_, i) => {
    const binStart = minPrice + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = priceArray.filter(
      (v) => v >= binStart && (i === numBins - 1 ? v <= binEnd : v < binEnd)
    ).length;
    return {
      range: `${binStart.toFixed(0)}`,
      rangeLabel: `$${binStart.toFixed(0)}`,
      binStart,
      binEnd,
      count,
      frequency: count / n,
    };
  });

  return {
    expectedPrice,
    variancePrice,
    stdDevPrice,
    expectedMac,
    expectedMod,
    expectedConvexity,
    histogram,
    numSimulations: n,
  };
}

/**
 * Versión asíncrona de la simulación Monte Carlo para Bonos.
 *
 * @param {object}   params
 * @param {object}   params.faceValueSpec    - Spec de distribución para el valor nominal
 * @param {object[]} params.cashFlowSpecs    - Array de specs de distribución por periodo (los cupones)
 * @param {object}   params.ytmSpec          - Spec de distribución de la YTM (en %)
 * @param {number}   params.frequency        - Frecuencia de capitalización
 * @param {number}   params.numSimulations   - Cantidad de simulaciones
 * @param {function} onProgress              - Callback: (completadas, total) => void
 * @param {number}   batchSize               - Iteraciones por lote (defecto: 500)
 * @returns {Promise<object>}
 */
export function runBondsMonteCarloAsync({
  faceValueSpec,
  cashFlowSpecs,
  ytmSpec,
  frequency,
  numSimulations,
  onProgress = () => {},
  batchSize = 500,
}) {
  return new Promise((resolve) => {
    const priceArray = [];
    const macDurationArray = [];
    const modDurationArray = [];
    const convexityArray = [];
    let completed = 0;

    function runBatch() {
      const end = Math.min(completed + batchSize, numSimulations);

      for (let sim = completed; sim < end; sim++) {
        // Muestrear YTM
        const ytmPercent = sampleFromSpec(ytmSpec);
        const ytm = ytmPercent / 100;

        // Muestrear Valor Nominal
        const faceValue = sampleFromSpec(faceValueSpec);

        // Muestrear Flujos de Caja
        const sampledFlows = cashFlowSpecs.map(spec => sampleFromSpec(spec));

        // Calcular Métricas para esta iteración
        const price = calculateBondPrice(faceValue, sampledFlows, ytm, frequency);
        const mac = calculateMacaulayDuration(faceValue, sampledFlows, ytm, frequency);
        const mod = calculateModifiedDuration(mac, ytm, frequency);
        const conv = calculateConvexity(faceValue, sampledFlows, ytm, frequency);

        priceArray.push(price);
        macDurationArray.push(mac);
        modDurationArray.push(mod);
        convexityArray.push(conv);
      }

      completed = end;
      onProgress(completed, numSimulations);

      if (completed < numSimulations) {
        setTimeout(runBatch, 0);
      } else {
        resolve(computeBondResults(priceArray, macDurationArray, modDurationArray, convexityArray));
      }
    }

    onProgress(0, numSimulations);
    setTimeout(runBatch, 0);
  });
}
