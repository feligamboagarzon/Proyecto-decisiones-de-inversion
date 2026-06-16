# Graph Report - Proyecto decisiones de inversion  (2026-06-16)

## Corpus Check
- 22 files · ~10,641 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 111 nodes · 160 edges · 14 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4a10abef`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `CLAUDE.md — Reglas para Claude en el pipeline multi-modelo` - 11 edges
2. `formatPercentage()` - 9 edges
3. `ModuleRates()` - 7 edges
4. `ModuleBonds()` - 6 edges
5. `ModuleMonteCarlo()` - 6 edges
6. `formatCurrency()` - 6 edges
7. `GEMINI.md — Reglas para Gemini en el pipeline multi-modelo` - 6 edges
8. `scripts` - 5 edges
9. `ModuleWaccCapm()` - 5 edges
10. `formatNumber()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ModuleRates()` --calls--> `formatPercentage()`  [EXTRACTED]
  src/components/ModuleRates.jsx → src/utils/format.js
- `ModuleWaccCapm()` --calls--> `formatPercentage()`  [EXTRACTED]
  src/components/ModuleWaccCapm.jsx → src/utils/format.js
- `ModuleBonds()` --calls--> `runBondsMonteCarloAsync()`  [EXTRACTED]
  src/components/ModuleBonds.jsx → src/utils/bondsMontecarlo.js
- `ModuleBonds()` --calls--> `formatCurrency()`  [EXTRACTED]
  src/components/ModuleBonds.jsx → src/utils/format.js
- `ModuleBonds()` --calls--> `formatNumber()`  [EXTRACTED]
  src/components/ModuleBonds.jsx → src/utils/format.js

## Import Cycles
- None detected.

## Communities (14 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (13): dependencies, react, react-dom, recharts, name, private, scripts, build (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.37
Nodes (8): DistributionInput(), ModuleBonds(), ModuleMonteCarlo(), runBondsMonteCarloAsync(), formatCurrency(), formatNumber(), formatPercentage(), runMonteCarloAsync()

### Community 2 - "Community 2"
Cohesion: 0.36
Nodes (5): ModuleWaccCapm(), Sidebar(), App(), calculateCAPM(), calculateWACC()

### Community 3 - "Community 3"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (8): 1. Stack Tecnológico Recomendado, 2. Regla Universal de Precisión, 3. Especificaciones por Módulo, Documento de Arquitectura y Requerimientos: Proyecto "Anti-Gravity", Módulo I: Simulador Estocástico de Proyectos (Monte Carlo), Módulo II: Analizador Dinámico de Proyectos Mutuamente Excluyentes, Módulo III: Plataforma de Valoración y Sensibilidad de Renta Fija (Bonos), Plataforma Integral de Decisiones de Inversión

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (5): ModuleRates(), calculateForeignCurrencyRate(), calculateRealRate(), convertToEA(), generateEquivalentRatesMatrix()

### Community 6 - "Community 6"
Cohesion: 0.57
Nodes (4): calculateBondPrice(), calculateConvexity(), calculateMacaulayDuration(), calculateModifiedDuration()

### Community 7 - "Community 7"
Cohesion: 0.52
Nodes (5): boxMullerRandom(), calculateIRR(), calculateNPV(), runMonteCarloSimulation(), sampleFromSpec()

### Community 8 - "Community 8"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (16): 1.1 Intercepción de Tareas sin Plan de Implementación (Ahorro de Costos), 1. Quién eres en este flujo, 2. Regla de oro: graph-first (ahorro de tokens), 3. Regla inquebrantable: Aislamiento de contexto (Lazy Loading), 4. Etapa 2 — Código pesado / complejo, 5. Etapa 5 — Ejecutar y corregir tests, 6. Protocolo de handoff, 7.1. Lectura por rangos, no archivos completos (idea 7) (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (6): 1. Tu rol (etapas 1, 1b, 4), 2. Graph-first (ahorro de tokens), 3. Contrato de Lazy Loading (aislamiento de contexto), 4. Handoff, 5. Lectura de documentos, GEMINI.md — Reglas para Gemini en el pipeline multi-modelo

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (3): Cómo usarla, Handoff <!-- fecha: YYYY-MM-DD · proyecto: <nombre> -->, HANDOFF — Resumen de nodos modificados (etapa 2 → etapa 4)

## Knowledge Gaps
- **47 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `formatPercentage()` connect `Community 1` to `Community 2`, `Community 5`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Community 11` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._