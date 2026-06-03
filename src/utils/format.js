/**
 * Formatea un valor numérico como moneda con separador de miles y decimales.
 * @param {number} value - El número a formatear.
 * @param {number} decimals - Cantidad de decimales (defecto 2).
 * @returns {string}
 */
export const formatCurrency = (value, decimals = 2) => {
  if (typeof value !== 'number' || isNaN(value)) return '$ 0.00';
  return '$ ' + value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formatea un valor numérico como porcentaje.
 * @param {number} value - El número a formatear (ej. 0.1567 para 15.67%).
 * @param {number} decimals - Cantidad de decimales (defecto 2).
 * @returns {string}
 */
export const formatPercentage = (value, decimals = 2) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00%';
  const val = value * 100;
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + '%';
};

/**
 * Formatea un número genérico con separadores de miles y decimales.
 * @param {number} value - El número a formatear.
 * @param {number} decimals - Cantidad de decimales (defecto 2).
 * @returns {string}
 */
export const formatNumber = (value, decimals = 2) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Mantenemos formatFinancial por compatibilidad con los otros módulos temporalmente
 */
export const formatFinancial = (value) => {
  if (typeof value === 'number') {
    return value.toFixed(7);
  }
  return value;
};
