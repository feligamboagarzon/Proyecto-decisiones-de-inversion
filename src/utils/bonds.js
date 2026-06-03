/**
 * Motor Matemático para la Valoración y Riesgo de Bonos
 * Modificado para soportar arrays de flujos de caja variables.
 */

/**
 * Calcula el Precio Limpio del bono dado un array de flujos de caja.
 *
 * @param {number} faceValue - Valor nominal del bono, pagado al final.
 * @param {number[]} cashFlows - Array de cupones por periodo.
 * @param {number} ytm - Rendimiento al vencimiento (YTM) anual en decimal.
 * @param {number} frequency - Frecuencia de pagos por año (1, 2, 4, 12).
 * @returns {number} Precio del bono.
 */
export function calculateBondPrice(faceValue, cashFlows, ytm, frequency) {
  const n = cashFlows.length;
  const r = ytm / frequency;

  let price = 0;
  for (let i = 0; i < n; i++) {
    // i es índice 0, pero el periodo es i+1
    price += cashFlows[i] / Math.pow(1 + r, i + 1);
  }
  price += faceValue / Math.pow(1 + r, n);

  return price;
}

/**
 * Calcula la Duration de Macaulay (en años) dado un array de flujos.
 */
export function calculateMacaulayDuration(faceValue, cashFlows, ytm, frequency) {
  const price = calculateBondPrice(faceValue, cashFlows, ytm, frequency);
  if (price === 0) return 0;

  const n = cashFlows.length;
  const r = ytm / frequency;

  let timeWeightedCashFlows = 0;
  for (let i = 0; i < n; i++) {
    const period = i + 1;
    timeWeightedCashFlows += (period * cashFlows[i]) / Math.pow(1 + r, period);
  }
  timeWeightedCashFlows += (n * faceValue) / Math.pow(1 + r, n);

  return (timeWeightedCashFlows / price) / frequency;
}

/**
 * Calcula la Duration Modificada (en años).
 */
export function calculateModifiedDuration(macaulayDuration, ytm, frequency) {
  const r = ytm / frequency;
  return macaulayDuration / (1 + r);
}

/**
 * Calcula la Convexidad Anualizada del bono dado un array de flujos.
 */
export function calculateConvexity(faceValue, cashFlows, ytm, frequency) {
  const price = calculateBondPrice(faceValue, cashFlows, ytm, frequency);
  if (price === 0) return 0;

  const n = cashFlows.length;
  const r = ytm / frequency;

  let convexCashFlows = 0;
  for (let i = 0; i < n; i++) {
    const period = i + 1;
    convexCashFlows += (period * (period + 1) * cashFlows[i]) / Math.pow(1 + r, period);
  }
  convexCashFlows += (n * (n + 1) * faceValue) / Math.pow(1 + r, n);

  const multiplier = 1 / (price * Math.pow(1 + r, 2) * Math.pow(frequency, 2));
  return multiplier * convexCashFlows;
}
