export type DeviceOs = "windows" | "macos" | "linux";
export type DeviceStatus = "online" | "offline" | "managed";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export type Device = {
  id: string;
  name: string;
  organization: string;
  os: DeviceOs;
  status: DeviceStatus;
  groupPath: string[];
  tags: string[];
  securityScore: number;
  maintenanceMode: boolean;
  lastSeenMinutesAgo: number;
  alerts: number;
  connectionQuality: number;
};

export type ConditionOperator = "equals" | "includes" | "greater_than" | "less_than";

export type Condition = {
  id: string;
  label: string;
  field: "tag" | "os" | "status" | "securityScore" | "maintenanceMode" | "organization";
  operator: ConditionOperator;
  value: string | number | boolean;
};

export type Trigger =
  | { type: "schedule"; label: string; config: { cadence: string; window: string } }
  | { type: "alert"; label: string; monitorId: string }
  | { type: "device_event"; label: string; eventName: string }
  | { type: "webhook"; label: string; source: string };

export type RetryPolicy = {
  attempts: number;
  backoffSeconds: number;
  retryOn: string[];
};

export type ActionNode = {
  id: string;
  type:
    | "script"
    | "patch"
    | "reboot"
    | "notify"
    | "branch"
    | "webhook"
    | "diagnostics"
    | "tag";
  name: string;
  description: string;
  conditions: Condition[];
  inputs: Record<string, string | number | boolean>;
  outputs?: Record<string, string | number | boolean>;
  retryPolicy?: RetryPolicy;
  risk: RiskLevel;
  estimatedSeconds: number;
};

export type Workflow = {
  id: string;
  name: string;
  version: string;
  owner: string;
  status: "draft" | "staged" | "published";
  triggers: Trigger[];
  actions: ActionNode[];
  targetConditions: Condition[];
  updatedAt: string;
};

export type ExcludedDevice = {
  id: string;
  reason: string;
};

export type SimulatedStep = {
  id: string;
  actionId: string;
  actionName: string;
  status: "passed" | "skipped" | "failed" | "retrying";
  durationMs: number;
  inputs: Record<string, string | number | boolean>;
  outputs: Record<string, string | number | boolean>;
  variables: Record<string, string | number | boolean>;
  decisionTrace: string[];
};

export type SimulationResult = {
  workflowId: string;
  matchedDevices: string[];
  excludedDevices: ExcludedDevice[];
  steps: SimulatedStep[];
  riskLevel: RiskLevel;
  estimatedDurationSeconds: number;
};

export type RunStep = SimulatedStep & {
  startedAt: string;
  attempt: number;
  logLines: string[];
};

export type HistoricalRun = {
  id: string;
  workflowId: string;
  workflowName: string;
  version: string;
  startedAt: string;
  completedAt: string;
  status: "succeeded" | "failed" | "partial";
  devicesEvaluated: number;
  devicesSucceeded: number;
  devicesFailed: number;
  failedStepId?: string;
  steps: RunStep[];
};

export type AiInsight = {
  id: string;
  title: string;
  prompt: string;
  summary: string;
  confidence: number;
  tone: "risk" | "explain" | "optimize" | "runbook";
};
