# 0001 Frontend-First MVP

## Decision

Build FlowLab as a frontend-first monorepo with typed local packages for domain logic, schema, and mock data.

## Context

The project is meant to demonstrate complex product UX, workflow modeling, and debugging affordances. A full backend would add setup cost without improving the core hiring signal.

## Consequences

- UI screens can be developed quickly with credible data.
- Workflow logic remains testable outside React.
- The GraphQL BFF can be implemented later without changing the domain model.
- Real-time behavior is mocked locally until SSE or WebSocket transport is added.
