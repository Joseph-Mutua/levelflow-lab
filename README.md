# Level FlowLab

Level FlowLab is a simulation and debugging workspace for RMM automations. It helps IT teams preview blast radius, validate workflow logic, inspect variable propagation, and replay historical runs before and after deployment.

## What It Solves

Automation is powerful, but risky when it targets large fleets. FlowLab gives operators a staging layer for checking scope, exclusions, step behavior, retry paths, and historical run differences before a workflow is enabled in production.

## Key Features

- Fleet Overview dashboard with live estate health, OS mix, risky endpoints, recent automation activity, and alert load by organization.
- Automation Builder with a visual node canvas, trigger/action palette, risk badges, conditions, variable lineage, inspector, and validation drawer.
- Blast Radius Preview showing matched devices, exclusions, maintenance-mode conflicts, affected groups/tags, risk level, and estimated action count.
- Step-by-Step Simulation Console with workflow timeline, inputs, outputs, variable inspector, decision trace, retry path, and execution logs.
- Run Replay debugger with run history, timeline scrubber, failed step details, logs, grouped failure patterns, diff view, and device state snapshot.
- AI Assistant panel for explaining targeting, summarizing failed runs, suggesting safer rollout conditions, and drafting operational runbooks.

## Architecture

```txt
apps/
  web/                  Next.js app shell and product screens
  api/                  Mock GraphQL BFF resolver boundary
packages/
  mock-data/            Realistic fleet, workflow, run, trend, and AI sample data
  workflow-engine/      Typed workflow models, condition evaluation, blast radius, simulation
  graphql-schema/       GraphQL schema SDL for the BFF boundary
  ui/                   Shared package placeholder for future extracted UI primitives
docs/
  architecture.md
  product-spec.md
  decisions/
```

## Scripts

```bash
npm install --workspaces --include-workspace-root
npm run dev
npm run build
npm run typecheck
npm run test
```

## Verification Notes

The workflow-engine Vitest suite passed with 4 tests after dependencies were installed:

- condition evaluation
- maintenance-mode blast-radius exclusion
- fleet summary counters
- retry-path simulation for low connection quality

On this machine, subsequent clean dependency installation became registry/network-bound and repeatedly timed out before rebuilding a fresh `node_modules`. The committed `package-lock.json` is present, and `npm ci --workspaces --include-workspace-root` is the recommended clean install command.

## Tradeoffs

- The product uses mock data and deterministic simulation logic to keep the demo frontend-first and easy to reason about.
- The GraphQL layer is represented as schema plus resolver boundaries rather than a running server, which keeps the MVP focused on product UX and domain modeling.
- Real-time behavior is mocked with local Zustand state and a live debug drawer; this can later be backed by SSE or WebSocket events.

## Future Work

- Automation revision comparison and policy-aware recommendations.
- Safe rollout mode with sampled cohorts before full deployment.
- Run anomaly detection across organizations and device groups.
- Remote-session correlation for failed automations that require technician intervention.
