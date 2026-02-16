import type { AiInsight, Device, HistoricalRun, Workflow } from "@levelflow/workflow-engine";

export const devices: Device[] = [
  {
    id: "dev-001",
    name: "fin-srv-payroll-03",
    organization: "Northstar Finance",
    os: "windows",
    status: "online",
    groupPath: ["Northstar Finance", "Servers", "Payroll"],
    tags: ["SERVER", "VPN", "Windows-Patch", "Critical"],
    securityScore: 91,
    maintenanceMode: false,
    lastSeenMinutesAgo: 2,
    alerts: 1,
    connectionQuality: 97
  },
  {
    id: "dev-002",
    name: "hr-ltp-onboarding-18",
    organization: "Northstar Finance",
    os: "windows",
    status: "offline",
    groupPath: ["Northstar Finance", "Endpoints", "HR"],
    tags: ["NEW-HIRE", "Windows-Patch"],
    securityScore: 68,
    maintenanceMode: false,
    lastSeenMinutesAgo: 84,
    alerts: 3,
    connectionQuality: 41
  },
  {
    id: "dev-003",
    name: "infra-db-replica-02",
    organization: "Aster Health",
    os: "linux",
    status: "online",
    groupPath: ["Aster Health", "Infra", "Database"],
    tags: ["SERVER", "Linux", "Maintenance-Window"],
    securityScore: 88,
    maintenanceMode: true,
    lastSeenMinutesAgo: 1,
    alerts: 0,
    connectionQuality: 99
  },
  {
    id: "dev-004",
    name: "ops-macbook-maya",
    organization: "Cobalt Retail",
    os: "macos",
    status: "managed",
    groupPath: ["Cobalt Retail", "Operations", "Field"],
    tags: ["macOS", "VPN", "Remote"],
    securityScore: 82,
    maintenanceMode: false,
    lastSeenMinutesAgo: 14,
    alerts: 1,
    connectionQuality: 82
  },
  {
    id: "dev-005",
    name: "retail-pos-441",
    organization: "Cobalt Retail",
    os: "windows",
    status: "online",
    groupPath: ["Cobalt Retail", "Stores", "POS"],
    tags: ["POS", "Windows-Patch", "No-Reboot"],
    securityScore: 76,
    maintenanceMode: false,
    lastSeenMinutesAgo: 5,
    alerts: 2,
    connectionQuality: 74
  },
  {
    id: "dev-006",
    name: "support-vdi-07",
    organization: "Helio MSP",
    os: "windows",
    status: "offline",
    groupPath: ["Helio MSP", "Support", "VDI"],
    tags: ["VDI", "Windows-Patch", "Flaky"],
    securityScore: 54,
    maintenanceMode: false,
    lastSeenMinutesAgo: 192,
    alerts: 5,
    connectionQuality: 28
  },
  {
    id: "dev-007",
    name: "prod-api-edge-01",
    organization: "Aster Health",
    os: "linux",
    status: "online",
    groupPath: ["Aster Health", "Production", "Edge"],
    tags: ["SERVER", "API", "High-Availability"],
    securityScore: 94,
    maintenanceMode: false,
    lastSeenMinutesAgo: 1,
    alerts: 0,
    connectionQuality: 98
  },
  {
    id: "dev-008",
    name: "legal-ltp-case-22",
    organization: "Northstar Finance",
    os: "windows",
    status: "managed",
    groupPath: ["Northstar Finance", "Endpoints", "Legal"],
    tags: ["Windows-Patch", "VPN", "Sensitive"],
    securityScore: 72,
    maintenanceMode: true,
    lastSeenMinutesAgo: 33,
    alerts: 2,
    connectionQuality: 69
  }
];

export const workflows: Workflow[] = [
  {
    id: "wf-patch-rollout",
    name: "Windows Server Patch Rollout",
    version: "v4.8.2",
    owner: "Priya Shah",
    status: "staged",
    updatedAt: "2026-04-16T17:42:00Z",
    triggers: [
      {
        type: "schedule",
        label: "Sunday maintenance window",
        config: { cadence: "weekly", window: "Sun 02:00-05:00" }
      }
    ],
    targetConditions: [
      { id: "c-tag-patch", label: "tag=Windows-Patch", field: "tag", operator: "includes", value: "Windows-Patch" },
      { id: "c-os-win", label: "os=windows", field: "os", operator: "equals", value: "windows" }
    ],
    actions: [
      {
        id: "act-health",
        type: "script",
        name: "Preflight device health",
        description: "Collects disk, battery, and service readiness before patching.",
        conditions: [],
        inputs: { script: "preflight-health.ps1", timeoutSeconds: 90 },
        outputs: { preflightOk: true, freeDiskGb: 44 },
        risk: "low",
        estimatedSeconds: 45
      },
      {
        id: "act-install",
        type: "patch",
        name: "Install approved updates",
        description: "Applies the approved Windows update bundle.",
        conditions: [
          { id: "c-online", label: "status=online", field: "status", operator: "equals", value: "online" }
        ],
        inputs: { policy: "Critical + Security", maxRuntimeMinutes: 45 },
        outputs: { lastPatchResult: "installed", rebootRequired: true },
        retryPolicy: { attempts: 2, backoffSeconds: 120, retryOn: ["agent_timeout", "download_failed"] },
        risk: "medium",
        estimatedSeconds: 1440
      },
      {
        id: "act-reboot",
        type: "reboot",
        name: "Reboot if required",
        description: "Reboots only devices that reported rebootRequired=true.",
        conditions: [
          { id: "c-server", label: "tag=SERVER", field: "tag", operator: "includes", value: "SERVER" }
        ],
        inputs: { deferMinutes: 15, forceAfterMinutes: 90 },
        outputs: { rebootQueued: true },
        risk: "high",
        estimatedSeconds: 900
      },
      {
        id: "act-report",
        type: "notify",
        name: "Send rollout report",
        description: "Posts a summary to the infrastructure channel and on-call inbox.",
        conditions: [],
        inputs: { channel: "#infra-ops", includeFailures: true },
        outputs: { reportId: "rpt-4418" },
        risk: "low",
        estimatedSeconds: 20
      }
    ]
  }
];

export const historicalRuns: HistoricalRun[] = [
  {
    id: "run-8841",
    workflowId: "wf-patch-rollout",
    workflowName: "Windows Server Patch Rollout",
    version: "v4.8.2",
    startedAt: "2026-04-16T02:00:00Z",
    completedAt: "2026-04-16T02:43:28Z",
    status: "partial",
    devicesEvaluated: 1284,
    devicesSucceeded: 1046,
    devicesFailed: 42,
    failedStepId: "act-install",
    steps: [
      {
        id: "step-1",
        actionId: "act-health",
        actionName: "Preflight device health",
        status: "passed",
        durationMs: 39000,
        startedAt: "2026-04-16T02:00:12Z",
        attempt: 1,
        inputs: { script: "preflight-health.ps1" },
        outputs: { preflightOk: true, freeDiskGb: 44 },
        variables: { targetCount: 1284, excludedMaintenance: 88 },
        decisionTrace: ["Target set created from Windows-Patch tag", "Maintenance mode devices excluded"],
        logLines: ["preflight started", "disk check passed", "agent heartbeat confirmed"]
      },
      {
        id: "step-2",
        actionId: "act-install",
        actionName: "Install approved updates",
        status: "failed",
        durationMs: 1548000,
        startedAt: "2026-04-16T02:01:01Z",
        attempt: 2,
        inputs: { policy: "Critical + Security" },
        outputs: { lastPatchResult: "download_failed", rebootRequired: false },
        variables: { retryReason: "download_failed", failureCluster: "offline endpoints" },
        decisionTrace: ["212 devices were offline at dispatch", "42 devices failed after retry window"],
        logLines: ["download package resolved", "retry scheduled after agent_timeout", "42 devices exceeded retry policy"]
      }
    ]
  }
];

export const aiInsights: AiInsight[] = [
  {
    id: "ai-1",
    title: "Tighten rollout targeting",
    prompt: "Suggest safer conditions before enabling",
    summary:
      "Add a connectionQuality > 70 guard and exclude No-Reboot devices from the reboot branch. This reduces likely failures without weakening the patch target.",
    confidence: 0.91,
    tone: "risk"
  },
  {
    id: "ai-2",
    title: "Step 3 failure summary",
    prompt: "Summarize why 42 devices failed at step 3",
    summary:
      "Most failures came from endpoints that were offline during the update download retry window. A smaller cluster had low disk headroom after preflight.",
    confidence: 0.87,
    tone: "explain"
  },
  {
    id: "ai-3",
    title: "Reusable remediation",
    prompt: "Convert this alert remediation into a reusable workflow",
    summary:
      "Use alert severity, service name, and organization as variables, then branch diagnostics before restart so technicians receive better context.",
    confidence: 0.82,
    tone: "runbook"
  }
];

export const fleetTrends = [
  { label: "10:00", online: 4310, offline: 352, alerts: 96 },
  { label: "11:00", online: 4398, offline: 318, alerts: 88 },
  { label: "12:00", online: 4421, offline: 301, alerts: 81 },
  { label: "13:00", online: 4388, offline: 336, alerts: 92 },
  { label: "14:00", online: 4455, offline: 290, alerts: 67 },
  { label: "15:00", online: 4498, offline: 264, alerts: 53 }
];

export const osDistribution = [
  { name: "Windows", value: 68 },
  { name: "macOS", value: 19 },
  { name: "Linux", value: 13 }
];

export const recentActivity = [
  "Windows Server Patch Rollout staged by Priya Shah",
  "Service self-heal remediation resolved 18 alerts",
  "Offline device incident flow opened 7 technician notes",
  "Northstar Finance moved 88 devices into maintenance mode"
];
