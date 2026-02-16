"use client";

import { ChevronLeft, ChevronRight, Code2, RotateCcw, Terminal } from "lucide-react";
import { devices, workflows } from "@levelflow/mock-data";
import { simulateDevice } from "@levelflow/workflow-engine";
import { Badge, Panel, SectionHeading, StatusDot } from "./ui";

const workflow = workflows[0];
const device = devices[5];
const steps = simulateDevice(workflow, device);
const selectedStep = steps[1];

export function SimulationConsole() {
  return (
    <main className="simulation-screen">
      <div className="screen-title">
        <div>
          <div className="kicker">Step-by-step simulation</div>
          <h2>{workflow.name}</h2>
          <p>Dry run for {device.name}, including conditions, variables, retries, and decisions.</p>
        </div>
        <div className="sim-controls">
          <button className="app-button secondary" type="button">
            <ChevronLeft size={15} />
            Back
          </button>
          <button className="app-button primary" type="button">
            <ChevronRight size={15} />
            Step forward
          </button>
        </div>
      </div>

      <section className="simulation-layout">
        <Panel className="panel-inner sim-timeline">
          <SectionHeading kicker="Workflow trace" title="Execution steps" description="Current step is paused at retry evaluation." />
          {steps.map((step, index) => (
            <div className={step.id === selectedStep.id ? "step-row active" : "step-row"} key={step.id}>
              <span className="step-index">{index + 1}</span>
              <div>
                <strong>{step.actionName}</strong>
                <small>{step.durationMs / 1000}s / {step.status}</small>
              </div>
              <Badge tone={step.status === "passed" ? "green" : step.status === "retrying" ? "amber" : step.status === "failed" ? "red" : "blue"}>
                {step.status}
              </Badge>
            </div>
          ))}
        </Panel>

        <Panel className="panel-inner sim-detail">
          <SectionHeading kicker="Selected step" title={selectedStep.actionName} description="Inputs, outputs, and decision trace for the simulated device." />
          <div className="io-grid">
            <CodePanel title="Inputs" data={selectedStep.inputs} />
            <CodePanel title="Outputs" data={selectedStep.outputs} />
          </div>

          <div className="trace-panel">
            <h3>Decision trace</h3>
            {selectedStep.decisionTrace.map((line) => (
              <div className="trace-line" key={line}>
                <StatusDot tone={line.includes("false") || line.includes("Retry") ? "amber" : "green"} />
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="console-log">
            <div className="console-title">
              <Terminal size={15} />
              execution log
            </div>
            <code>download package resolved</code>
            <code>agent_timeout detected on support-vdi-07</code>
            <code>retry branch scheduled after 120 seconds</code>
          </div>
        </Panel>

        <aside className="sim-side">
          <Panel className="panel-inner">
            <SectionHeading kicker="Device context" title={device.name} description={device.groupPath.join(" / ")} />
            <div className="device-context">
              <Badge tone="red">{device.status}</Badge>
              <Badge tone="amber">quality {device.connectionQuality}%</Badge>
              <Badge tone="blue">score {device.securityScore}</Badge>
              <Badge tone="purple">{device.organization}</Badge>
            </div>
          </Panel>

          <Panel className="panel-inner">
            <SectionHeading kicker="Variables" title="Available at step" description="Produced values visible to downstream actions." />
            <div className="variable-stack">
              {Object.entries(selectedStep.variables).map(([key, value]) => (
                <div className="variable-row" key={key}>
                  <code>{key}</code>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="panel-inner retry-card">
            <RotateCcw size={18} />
            <strong>Retry path selected</strong>
            <p>Connection quality is below 50, so the patch action uses the configured backoff policy before failure escalation.</p>
          </Panel>
        </aside>
      </section>
    </main>
  );
}

function CodePanel({ title, data }: { title: string; data: Record<string, string | number | boolean> }) {
  return (
    <div className="code-panel">
      <h3>
        <Code2 size={14} />
        {title}
      </h3>
      {Object.entries(data).map(([key, value]) => (
        <div className="code-row" key={key}>
          <code>{key}</code>
          <span>{String(value)}</span>
        </div>
      ))}
    </div>
  );
}
