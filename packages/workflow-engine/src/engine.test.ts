import { describe, expect, it } from "vitest";
import type { Device, Workflow } from "./models";
import {
  evaluateCondition,
  previewBlastRadius,
  simulateDevice,
  summarizeFleet
} from "./engine";

const workflow: Workflow = {
  id: "wf-test",
  name: "Patch test",
  version: "v1",
  owner: "Test Operator",
  status: "staged",
  updatedAt: "2026-04-17T00:00:00Z",
  triggers: [{ type: "schedule", label: "nightly", config: { cadence: "daily", window: "02:00" } }],
  targetConditions: [
    { id: "tag", label: "tag=Patch", field: "tag", operator: "includes", value: "Patch" },
    { id: "os", label: "os=windows", field: "os", operator: "equals", value: "windows" }
  ],
  actions: [
    {
      id: "patch",
      type: "patch",
      name: "Install updates",
      description: "Patch action",
      conditions: [{ id: "online", label: "status=online", field: "status", operator: "equals", value: "online" }],
      inputs: { policy: "critical" },
      outputs: { patched: true },
      retryPolicy: { attempts: 2, backoffSeconds: 60, retryOn: ["agent_timeout"] },
      risk: "medium",
      estimatedSeconds: 30
    }
  ]
};

const devices: Device[] = [
  {
    id: "dev-1",
    name: "win-online",
    organization: "Acme",
    os: "windows",
    status: "online",
    groupPath: ["Acme", "Servers"],
    tags: ["Patch"],
    securityScore: 90,
    maintenanceMode: false,
    lastSeenMinutesAgo: 1,
    alerts: 0,
    connectionQuality: 95
  },
  {
    id: "dev-2",
    name: "win-maintenance",
    organization: "Acme",
    os: "windows",
    status: "online",
    groupPath: ["Acme", "Servers"],
    tags: ["Patch"],
    securityScore: 90,
    maintenanceMode: true,
    lastSeenMinutesAgo: 1,
    alerts: 1,
    connectionQuality: 95
  },
  {
    id: "dev-3",
    name: "win-flaky",
    organization: "Acme",
    os: "windows",
    status: "online",
    groupPath: ["Acme", "VDI"],
    tags: ["Patch"],
    securityScore: 88,
    maintenanceMode: false,
    lastSeenMinutesAgo: 1,
    alerts: 2,
    connectionQuality: 30
  }
];

describe("workflow engine", () => {
  it("evaluates tag conditions against device tags", () => {
    expect(evaluateCondition(workflow.targetConditions[0], devices[0])).toBe(true);
  });

  it("excludes maintenance mode devices from blast-radius preview", () => {
    const preview = previewBlastRadius(workflow, devices);

    expect(preview.matchedDevices).toContain("dev-1");
    expect(preview.excludedDevices).toContainEqual({
      id: "dev-2",
      reason: "Device is in maintenance mode"
    });
  });

  it("summarizes fleet health counters", () => {
    expect(summarizeFleet(devices)).toMatchObject({
      total: 3,
      online: 3,
      maintenance: 1,
      alerts: 3
    });
  });

  it("selects retry path for low connection quality patch actions", () => {
    const [step] = simulateDevice(workflow, devices[2]);

    expect(step.status).toBe("retrying");
    expect(step.decisionTrace).toContain(
      "Retry branch selected because connection quality is below 50"
    );
  });
});
