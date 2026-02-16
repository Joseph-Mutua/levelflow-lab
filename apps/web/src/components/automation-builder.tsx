"use client";

import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps
} from "@xyflow/react";
import { AlertTriangle, Bell, Braces, GitBranch, Play, Save, ShieldAlert, Zap } from "lucide-react";
import { workflows } from "@levelflow/mock-data";
import type { ActionNode } from "@levelflow/workflow-engine";
import { Badge, Panel, SectionHeading } from "./ui";

type FlowNodeData = {
  title: string;
  subtitle: string;
  kind: "trigger" | "action" | "branch" | "notify";
  risk?: ActionNode["risk"];
  chips: string[];
};

const workflow = workflows[0];

const nodes: Node<FlowNodeData>[] = [
  {
    id: "trigger",
    type: "flowNode",
    position: { x: 60, y: 120 },
    data: {
      title: "Sunday maintenance window",
      subtitle: "schedule / weekly",
      kind: "trigger",
      chips: ["Sun 02:00", "all customers"]
    }
  },
  ...workflow.actions.map((action, index) => ({
    id: action.id,
    type: "flowNode",
    position: { x: 360 + index * 270, y: index === 2 ? 230 : 120 },
    data: {
      title: action.name,
      subtitle: `${action.type} / ${action.estimatedSeconds}s`,
      kind: action.type === "notify" ? "notify" : action.type === "branch" ? "branch" : "action",
      risk: action.risk,
      chips: [
        ...action.conditions.map((condition) => condition.label),
        ...(action.retryPolicy ? [`${action.retryPolicy.attempts} retries`] : [])
      ].slice(0, 3)
    }
  }))
];

const edges: Edge[] = [
  { id: "e-trigger-health", source: "trigger", target: "act-health", animated: true },
  { id: "e-health-install", source: "act-health", target: "act-install", animated: true },
  { id: "e-install-reboot", source: "act-install", target: "act-reboot", label: "rebootRequired" },
  { id: "e-install-report", source: "act-install", target: "act-report", label: "failure summary" },
  { id: "e-reboot-report", source: "act-reboot", target: "act-report" }
];

const nodeTypes = {
  flowNode: FlowNode
};

export function AutomationBuilder() {
  const selectedAction = workflow.actions[1];

  return (
    <main className="builder-screen">
      <section className="builder-toolbar panel">
        <div>
          <div className="kicker">Automation builder</div>
          <h2>{workflow.name}</h2>
          <p>
            {workflow.version} / {workflow.status} / owner {workflow.owner}
          </p>
        </div>
        <div className="builder-toolbar-actions">
          <button className="app-button secondary" type="button">
            <Save size={15} />
            Save draft
          </button>
          <button className="app-button secondary" type="button">
            <GitBranch size={15} />
            Version diff
          </button>
          <button className="app-button primary" type="button">
            <Play size={15} />
            Simulate
          </button>
        </div>
      </section>

      <section className="builder-layout">
        <Panel className="builder-palette panel-inner">
          <SectionHeading kicker="Library" title="Blocks" description="Drag triggers and actions into the staged workflow." />
          {[
            ["Schedule trigger", "Run at maintenance windows", Zap],
            ["Alert remediation", "Start from monitor breach", ShieldAlert],
            ["Run script", "PowerShell, Bash, or shell", Braces],
            ["Notify technician", "Email, Slack, or webhook", Bell]
          ].map(([title, detail, Icon]) => {
            const BlockIcon = Icon as typeof Zap;
            return (
              <div className="palette-block" key={String(title)}>
                <BlockIcon size={16} />
                <span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </span>
              </div>
            );
          })}
        </Panel>

        <Panel className="builder-canvas">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView minZoom={0.45} maxZoom={1.4}>
            <Background color="rgba(255,255,255,0.16)" gap={24} />
            <Controls />
            <MiniMap pannable zoomable nodeStrokeColor="#4f8cff" nodeColor="#151b27" maskColor="rgba(8,10,15,0.62)" />
          </ReactFlow>
        </Panel>

        <Panel className="builder-inspector panel-inner">
          <SectionHeading kicker="Inspector" title={selectedAction.name} description={selectedAction.description} />
          <div className="inspector-stack">
            <Badge tone="amber">Risk: {selectedAction.risk}</Badge>
            <Badge tone="cyan">Outputs lastPatchResult</Badge>
            <Badge tone="blue">Variable rebootRequired</Badge>
          </div>
          <div className="config-block">
            <span>Inputs</span>
            {Object.entries(selectedAction.inputs).map(([key, value]) => (
              <div className="config-row" key={key}>
                <strong>{key}</strong>
                <code>{String(value)}</code>
              </div>
            ))}
          </div>
          <div className="config-block">
            <span>Conditions</span>
            {selectedAction.conditions.map((condition) => (
              <div className="condition-chip" key={condition.id}>
                {condition.label}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel className="validation-drawer panel-inner">
        <div className="validation-item">
          <AlertTriangle size={16} />
          <span>Reboot branch affects SERVER-tagged devices. Confirm maintenance window before publish.</span>
        </div>
        <div className="validation-item ok">
          <Zap size={16} />
          <span>All variables used by downstream steps have producers in the workflow.</span>
        </div>
      </Panel>
    </main>
  );
}

function FlowNode({ data }: NodeProps<Node<FlowNodeData>>) {
  const tone = data.risk === "high" ? "red" : data.risk === "medium" ? "amber" : "cyan";

  return (
    <div className={`flow-node flow-node-${data.kind}`}>
      <Handle type="target" position={Position.Left} />
      <div className="flow-node-header">
        <span className="flow-icon">
          <Zap size={14} />
        </span>
        <Badge tone={tone}>{data.risk ? `${data.risk} risk` : data.kind}</Badge>
      </div>
      <strong>{data.title}</strong>
      <p>{data.subtitle}</p>
      <div className="node-chip-row">
        {data.chips.map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
