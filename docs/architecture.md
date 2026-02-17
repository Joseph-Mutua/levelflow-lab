# Architecture

Level FlowLab is split into product domains that map to the way operators investigate automation risk.

## Frontend

The web app uses a desktop-first shell with persistent navigation, a global operations header, contextual filters, and a live debug drawer. Screens are organized around operator tasks:

- Overview/Fleet: estate health and alert pressure
- Automations: workflow design and validation
- Blast Radius: target preview and exclusion reasoning
- Simulation: single-device execution inspection
- Run Replay: historical debugging and run diffing
- AI Assistant: contextual explanation and safer rollout guidance

## Domain Packages

`packages/workflow-engine` owns typed models and deterministic functions:

- `evaluateCondition`
- `previewBlastRadius`
- `simulateDevice`
- `summarizeFleet`

`packages/mock-data` owns credible sample data that can later be replaced by API calls without changing UI contracts.

`packages/graphql-schema` defines the mock BFF schema for devices, workflows, and simulation previews.

## State

Short-lived UI/debug state lives in a Zustand store:

- selected device
- selected workflow
- live event drawer state
- recent debug events

Server state is currently mocked through direct package imports and a Next route. In a production version, TanStack Query would sit between UI screens and the GraphQL BFF.
