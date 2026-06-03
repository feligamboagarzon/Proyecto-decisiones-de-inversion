/**
 * Motor Matemático para Conversión de Tasas de Interés
 * Soporta conversión entre tasas Efectivas, Nominales y Periódicas
 * para modalidades Vencidas y Anticipadas.
 */

/**
 * Convierte cualquier tasa a Efectiva Anual (EA)
 *
 * @param {number} rate - Tasa de interés en decimal (ej. 0.10 para 10%)
 * @param {string} type - 'effective', 'nominal', 'periodic'
 * @param {number} periods - Periodos de capitalización por año (ej. 12 para mensual)
 * @param {string} modality - 'vencida', 'anticipada'
 * @returns {number} - Tasa Efectiva Anual en decimal
 */
export function convertToEA(rate, type, periods = 1, modality = 'vencida') {
  if (type === 'effective') {
    return rate;
  }

  let pv = 0; // Tasa periódica vencida

  if (type === 'periodic') {
    if (modality === 'vencida') {
      pv = rate;
    } else { // anticipada
      // Evitar división por cero
      if (rate >= 1) return NaN;
      pv = rate / (1 - rate);
    }
  } else if (type === 'nominal') {
    if (modality === 'vencida') {
      pv = rate / periods;
    } else { // anticipada
      const pa = rate / periods;
      if (pa >= 1) return NaN;
      pv = pa / (1 - pa);
    }
  }

  // Convertir periódica vencida a EA
  return Math.pow(1 + pv, periods) - 1;
}

/**
 * Dada una tasa Efectiva Anual (EA), calcula todas las tasas equivalentes
 * para diferentes capitalizaciones.
 *
 * @param {number} ea - Tasa Efectiva Anual en decimal
 * @returns {Array} - Array con los cálculos para cada capitalización
 */
export function generateEquivalentRatesMatrix(ea) {
  const periodTypes = [
    { label: 'Anual', periods: 1 },
    { label: 'Semestral', periods: 2 },
    { label: 'Trimestral', periods: 4 },
    { label: 'Bimestral', periods: 6 },
    { label: 'Mensual', periods: 12 },
    { label: 'Quincenal', periods: 24 },
    { label: 'Diaria', periods: 360 }
  ];

  return periodTypes.map(pt => {
    const n = pt.periods;
    
    // Calcular Periódica Vencida (Pv)
    const pv = Math.pow(1 + ea, 1 / n) - 1;
    // Calcular Periódica Anticipada (Pa)
    const pa = pv / (1 + pv);
    
    // Nominales
    const nv = pv * n;
    const na = pa * n;

    return {
      label: pt.label,
      periods: n,
      periodicVencida: pv,
      periodicAnticipada: pa,
      nominalVencida: nv,
      nominalAnticipada: na
    };
  });
}

/**
 * Calcula la tasa real descontando la inflación (Ecuación de Fisher)
 *
 * @param {number} apparentRate - Tasa Efectiva Anual Aparente en decimal
 * @param {number} inflation - Tasa de Inflación en decimal
 * @returns {number} - Tasa Real en decimal
 */
export function calculateRealRate(apparentRate, inflation) {
  return ((1 + apparentRate) / (1 + inflation)) - 1;
}

/**
 * Calcula la tasa en moneda extranjera (ej. USD) a partir de una tasa en moneda local (ej. COP) y la devaluación
 *
 * @param {number} localRate - Tasa Efectiva Anual en Moneda Local en decimal
 * @param {number} devaluation - Devaluación de la moneda local respecto a la extranjera en decimal
 * @returns {number} - Tasa en Moneda Extranjera en decimal
 */
export function calculateForeignCurrencyRate(localRate, devaluation) {
  return ((1 + localRate) / (1 + devaluation)) - 1;
}
