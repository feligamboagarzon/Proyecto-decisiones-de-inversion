/**
 * Calcula el Costo de Capital (K_e) usando CAPM
 * @param {number} rf - Tasa libre de riesgo (en decimal, ej. 0.05)
 * @param {number} beta - Beta del activo
 * @param {number} rm - Retorno esperado del mercado (en decimal)
 * @param {number} countryRisk - Prima de riesgo país (en decimal, defecto 0)
 * @returns {number} Costo de Equity (K_e)
 */
export const calculateCAPM = (rf, beta, rm, countryRisk = 0) => {
  const marketRiskPremium = rm - rf;
  return rf + beta * marketRiskPremium + countryRisk;
};

/**
 * Calcula el Costo Promedio Ponderado de Capital (WACC)
 * @param {number} e - Valor de mercado del patrimonio (Equity)
 * @param {number} d - Valor de mercado de la deuda (Debt)
 * @param {number} ke - Costo del patrimonio (K_e)
 * @param {number} kd - Costo de la deuda (K_d)
 * @param {number} taxRate - Tasa de impuestos corporativa (en decimal)
 * @returns {number} WACC (en decimal)
 */
export const calculateWACC = (e, d, ke, kd, taxRate) => {
  const v = e + d;
  if (v === 0) return 0;
  
  const equityWeight = e / v;
  const debtWeight = d / v;
  
  return (equityWeight * ke) + (debtWeight * kd * (1 - taxRate));
};
