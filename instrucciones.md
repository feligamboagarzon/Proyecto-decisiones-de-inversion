# Documento de Arquitectura y Requerimientos: Proyecto "Anti-Gravity"
## Plataforma Integral de Decisiones de Inversión

Este documento establece las directrices técnicas, financieras y matemáticas para el desarrollo de la aplicación web "Anti-Gravity". La plataforma consolidará tres módulos de análisis financiero avanzado, garantizando un rigor matemático absoluto.

### 1. Stack Tecnológico Recomendado
* **Lenguaje:** Python 3.9+
* **Framework Web:** Streamlit o Dash (para una implementación ágil y analítica).
* **Librerías Matemáticas/Financieras:** `numpy` (cálculos vectoriales y simulación), `pandas` (estructuración de flujos), `scipy` (distribuciones de probabilidad y optimización de raíces para TIR/Fisher).
* **Visualización:** `plotly` o `matplotlib` para gráficos financieros interactivos.

---

### 2. Regla Universal de Precisión
**CRÍTICO:** Todos los motores de cálculo internos y las salidas en pantalla (cuando se requiera exactitud analítica) deben manejar una precisión de coma flotante estricta, mostrando al menos **7 cifras decimales** en tasas, factores de descuento y sensibilidades.

---

### 3. Especificaciones por Módulo

#### Módulo I: Simulador Estocástico de Proyectos (Monte Carlo)
* **Objetivo:** Evaluar la viabilidad de un proyecto bajo condiciones de incertidumbre.
* **Inputs del Usuario:**
    * Inversión Inicial ($I_0$).
    * Tasa de Interés de Oportunidad (TIO / WACC).
    * Horizonte de evaluación (n años).
    * Parámetros de distribución para los flujos de caja (Ej: Media y Desviación Estándar para una distribución Normal; Límites inferior y superior para una Uniforme).
* **Motor Matemático:**
    * Generar $N$ iteraciones (ej. 10,000) simulando los flujos de caja $FC_t$ para cada periodo.
    * Calcular el Valor Presente Neto (VPN) para cada iteración: 
        $$VPN = -I_0 + \sum_{t=1}^{n} \frac{FC_t}{(1+TIO)^t}$$
* **Outputs Requeridos:**
    * Valor Esperado del VPN: $E(VPN)$
    * Varianza y Desviación Estándar: $Var(VPN)$, $\sigma(VPN)$
    * Probabilidad de destrucción de valor: $P(VPN < 0)$
    * Histograma de distribución del VPN.

#### Módulo II: Analizador Dinámico de Proyectos Mutuamente Excluyentes
* **Objetivo:** Comparar múltiples alternativas de inversión para seleccionar la óptima maximizando la riqueza del inversionista.
* **Inputs del Usuario:**
    * Matriz de flujos de caja para $M$ proyectos durante $n$ periodos.
    * TIO base.
* **Motor Matemático:**
    * Cálculo del VPN y la Tasa Interna de Retorno (TIR) clásica para cada proyecto.
    * Cálculo de la TIR Modificada (TIRM) asumiendo tasas de reinversión/financiación explícitas.
    * Análisis Incremental ($\Delta$ Flujos) para hallar la **Tasa de Fisher** entre pares de proyectos (la tasa $r$ donde $VPN_A - VPN_B = 0$).
* **Outputs Requeridos:**
    * Tabla comparativa de VPN, TIR y TIRM.
    * Gráfico del Perfil del VPN (VPN en el eje Y, Tasa de Descuento en el eje X) evidenciando los puntos de cruce (Tasas de Fisher).
    * Conclusión algorítmica de qué proyecto elegir dependiendo del rango de la TIO.

#### Módulo III: Plataforma de Valoración y Sensibilidad de Renta Fija (Bonos)
* **Objetivo:** Calcular el precio justo de un bono y medir su exposición al riesgo de tasa de interés.
* **Inputs del Usuario:**
    * Valor Nominal (Face Value).
    * Tasa Cupón (y frecuencia de pago).
    * Plazo al vencimiento (Madurez en años/periodos).
    * Tasa de Rendimiento al Vencimiento (Yield to Maturity - YTM o Tasa de Mercado).
* **Motor Matemático:**
    * Cálculo del Precio Sucio/Limpio del bono descontando los cupones y el principal al YTM.
    * Cálculo de la **Duration de Macaulay** ($D_{Mac}$):
        $$D_{Mac} = \frac{\sum_{t=1}^{n} \frac{t \cdot CF_t}{(1+YTM)^t}}{Precio}$$
    * Cálculo de la **Duration Modificada** ($D_{Mod} = \frac{D_{Mac}}{1+YTM}$).
* **Outputs Requeridos:**
    * Precio actual del bono.
    * Métricas de Duration.
    * Simulador de choque: Impacto porcentual en el precio ante una variación del YTM (ej. $\Delta YTM = \pm 50$ puntos básicos), usando la aproximación de primer orden: $\Delta P/P \approx -D_{Mod} \cdot \Delta YTM$.

---
*Documento generado bajo estrictos estándares de evaluación financiera.*    