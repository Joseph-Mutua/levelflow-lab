import type {
  ActionNode,
  Condition,
  Device,
  ExcludedDevice,
  RiskLevel,
  SimulatedStep,
  SimulationResult,
  Workflow
} from "./models";

const riskScore: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

export function evaluateCondition(condition: Condition, device: Device): boolean {
  const fieldValue =
    condition.field === "tag"
      ? device.tags
      : condition.field === "organization"
        ? device.organization
        : device[condition.field];

  if (condition.operator === "includes") {
    return Array.isArray(fieldValue) && fieldValue.includes(String(condition.value));
  }

  if (condition.operator === "equals") {
    return fieldValue === condition.value;
  }

  if (condition.operator === "greater_than") {
    return Number(fieldValue) > Number(condition.value);
  }

  if (condition.operator === "less_than") {
    return Number(fieldValue) < Number(condition.value);
  }

  return false;
}

export function getConditionLabel(condition: Condition): string {
  const operator = condition.operator.replace("_", " ");
  return `${condition.field} ${operator} ${String(condition.value)}`;
}

export function getExclusionReason(workflow: Workflow, device: Device): string | null {
  const failedCondition = workflow.targetConditions.find(
    (condition) => !evaluateCondition(condition, device)
  );

  if (failedCondition) {
    return `Missing target condition: ${failedCondition.label}`;
  }

  if (device.maintenanceMode) {
    return "Device is in maintenance mode";
  }

  if (device.status === "offline") {
    return "Device is offline at dispatch";
  }

  return null;
}

export function previewBlastRadius(workflow: Workflow, fleet: Device[]): SimulationResult {
  const matchedDevices: string[] = [];
  const excludedDevices: ExcludedDevice[] = [];

  fleet.forEach((device) => {
    const reason = getExclusionReason(workflow, device);

    if (reason) {
      excludedDevices.push({ id: device.id, reason });
      return;
    }

    matchedDevices.push(device.id);
  });

  const highestRisk = workflow.actions.reduce<RiskLevel>((current, action) => {
    return riskScore[action.risk] > riskScore[current] ? action.risk : current;
  }, "low");

  return {
    workflowId: workflow.id,
    matchedDevices,
    excludedDevices,
    steps: [],
    riskLevel: highestRisk,
    estimatedDurationSeconds: workflow.actions.reduce(
      (total, action) => total + action.estimatedSeconds,
      0
    )
  };
}

export function simulateDevice(workflow: Workflow, device: Device): SimulatedStep[] {
  const variables: Record<string, string | number | boolean> = {
    deviceName: device.name,
    deviceOnline: device.status === "online",
    securityScore: device.securityScore
  };

  return workflow.actions.map((action, index) => {
    const conditionsPass = action.conditions.every((condition) =>
      evaluateCondition(condition, device)
    );
    const status = getStepStatus(action, device, conditionsPass);
    const outputs = status === "skipped" ? {} : (action.outputs ?? {});

    Object.assign(variables, outputs);

    return {
      id: `sim-${index + 1}`,
      actionId: action.id,
      actionName: action.name,
      status,
      durationMs: status === "skipped" ? 0 : action.estimatedSeconds * 1000,
      inputs: action.inputs,
      outputs,
      variables: { ...variables },
      decisionTrace: buildDecisionTrace(action, device, conditionsPass, status)
    };
  });
}

export function summarizeFleet(fleet: Device[]) {
  const online = fleet.filter((device) => device.status === "online").length;
  const offline = fleet.filter((device) => device.status === "offline").length;
  const maintenance = fleet.filter((device) => device.maintenanceMode).length;
  const alerts = fleet.reduce((total, device) => total + device.alerts, 0);
  const flagged = fleet.filter(
    (device) => device.alerts > 1 || device.securityScore < 70 || device.connectionQuality < 50
  ).length;

  return {
    total: fleet.length,
    online,
    offline,
    managed: fleet.length - online - offline,
    maintenance,
    alerts,
    flagged
  };
}

function getStepStatus(
  action: ActionNode,
  device: Device,
  conditionsPass: boolean
): SimulatedStep["status"] {
  if (!conditionsPass) {
    return "skipped";
  }

  if (action.type === "patch" && device.connectionQuality < 50) {
    return "retrying";
  }

  if (action.type === "patch" && device.securityScore < 60) {
    return "failed";
  }

  return "passed";
}

function buildDecisionTrace(
  action: ActionNode,
  device: Device,
  conditionsPass: boolean,
  status: SimulatedStep["status"]
) {
  const trace = action.conditions.length
    ? action.conditions.map((condition) =>
        evaluateCondition(condition, device)
          ? `${condition.label} evaluated true`
          : `${condition.label} evaluated false`
      )
    : ["No step conditions were required"];

  if (status === "retrying") {
    trace.push("Retry branch selected because connection quality is below 50");
  }

  if (status === "failed") {
    trace.push("Step failed because preflight risk remained unresolved");
  }

  if (!conditionsPass) {
    trace.push("Step skipped before dispatch");
  }

  return trace;
}
