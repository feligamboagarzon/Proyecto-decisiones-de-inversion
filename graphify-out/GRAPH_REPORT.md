# Graph Report - Proyecto decisiones de inversion  (2026-06-15)

## Corpus Check
- 19 files · ~8,245 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 83 nodes · 135 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce45887d`
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

## God Nodes (most connected - your core abstractions)
1. `formatPercentage()` - 9 edges
2. `ModuleRates()` - 7 edges
3. `ModuleBonds()` - 6 edges
4. `ModuleMonteCarlo()` - 6 edges
5. `formatCurrency()` - 6 edges
6. `scripts` - 5 edges
7. `ModuleWaccCapm()` - 5 edges
8. `formatNumber()` - 5 edges
9. `calculateBondPrice()` - 4 edges
10. `sampleFromSpec()` - 4 edges

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

## Communities (11 total, 0 thin omitted)

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

## Knowledge Gaps
- **27 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `formatPercentage()` connect `Community 1` to `Community 2`, `Community 5`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._