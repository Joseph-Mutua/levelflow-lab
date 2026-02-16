"use client";

import { Activity, Clock, Diff, Play, TriangleAlert } from "lucide-react";
import { historicalRuns } from "@levelflow/mock-data";
import { Badge, Panel, SectionHeading } from "./ui";

const run = historicalRuns[0];
const failedStep = run.steps.find((step) => step.id === "step-2") ?? run.steps[0];

export function RunReplay() {
  return (
    <main className="replay-screen">
      <div className="screen-title">
        <div>
          <div className="kicker">Run replay</div>
          <h2>{run.workflowName}</h2>
          <p>Historical debugger for {run.id}, comparing failed behavior against the previous successful run.</p>
        </div>
        <button className="app-button primary" type="button">
          <Play size={16} />
          Replay run
        </button>
      </div>

      <section className="replay-layout">
        <Panel className="panel-inner run-list">
          <SectionHeading kicker="History" title="Recent runs" description="Select a run to inspect execution state." />
          {[
            ["run-8841", "partial", "42 failures", "v4.8.2"],
            ["run-8792", "succeeded", "0 failures", "v4.8.1"],
            ["run-8705", "partial", "11 failures", "v4.7.9"],
            ["run-8612", "failed", "133 failures", "v4.7.8"]
          ].map(([id, status, failures, version]) => (
            <div className={id === run.id ? "run-row active" : "run-row"} key={id}>
              <strong>{id}</strong>
              <span>{version}</span>
              <Badge tone={status === "succeeded" ? "green" : status === "failed" ? "red" : "amber"}>{status}</Badge>
              <small>{failures}</small>
            </div>
          ))}
        </Panel>

        <Panel className="panel-inner replay-main">
          <SectionHeading kicker="Timeline" title="Execution playback" description="Step timing, retry attempts, and selected failure context." />
          <div className="timeline-scrubber">
            {run.steps.map((step) => (
              <div className={step.status === "failed" ? "scrub-segment failed" : "scrub-segment"} key={step.id}>
                <span>{step.actionName}</span>
              </div>
            ))}
          </div>

          <div className="replay-detail-grid">
            <div className="failure-card">
              <TriangleAlert size={18} />
              <div>
                <strong>{failedStep.actionName}</strong>
                <p>Retry attempt {failedStep.attempt} exceeded policy after {Math.round(failedStep.durationMs / 1000)} seconds.</p>
              </div>
            </div>
            <div className="duration-card">
              <Clock size={18} />
              <div>
                <strong>43m 28s</strong>
                <p>Run duration, 18% slower than the previous successful rollout.</p>
              </div>
            </div>
          </div>

          <div className="log-diff-grid">
            <Panel className="panel-inner">
              <SectionHeading kicker="Logs" title="Failed step output" />
              <div className="console-log replay-log">
                {failedStep.logLines.map((line) => (
                  <code key={line}>{line}</code>
                ))}
              </div>
            </Panel>
            <Panel className="panel-inner">
              <SectionHeading kicker="Run diff" title="Changed since success" />
              <div className="diff-list">
                <div><Diff size={15} /> Retry backoff increased from 60s to 120s</div>
                <div><Diff size={15} /> Target cohort added Helio VDI endpoints</div>
                <div><Diff size={15} /> Reboot branch now includes SERVER tag only</div>
              </div>
            </Panel>
          </div>
        </Panel>

        <aside className="replay-side">
          <Panel className="panel-inner">
            <SectionHeading kicker="Device failures" title="Grouped patterns" description="Clusters found across failing devices." />
            {[
              ["Offline at dispatch", 212, "red"],
              ["Download retry exceeded", 42, "amber"],
              ["Low disk after preflight", 17, "amber"],
              ["Maintenance suppressed", 88, "purple"]
            ].map(([label, count, tone]) => (
              <div className="failure-pattern" key={label}>
                <span>{label}</span>
                <Badge tone={tone as "red" | "amber" | "purple"}>{count}</Badge>
              </div>
            ))}
          </Panel>

          <Panel className="panel-inner state-snapshot">
            <SectionHeading kicker="Snapshot" title="State at failure" description="Device state captured at the failed step." />
            <div className="snapshot-row"><span>Agent version</span><strong>5.21.0</strong></div>
            <div className="snapshot-row"><span>Network</span><strong>flaky</strong></div>
            <div className="snapshot-row"><span>Disk free</span><strong>9.4 GB</strong></div>
            <div className="snapshot-row"><span>Last heartbeat</span><strong>11m ago</strong></div>
          </Panel>

          <Panel className="panel-inner">
            <SectionHeading kicker="Activity" title="Incident trail" />
            <div className="trace-line"><Activity size={14} /> <span>Technician note created after retry exhaustion.</span></div>
            <div className="trace-line"><Activity size={14} /> <span>Alert remained open for offline cohort.</span></div>
          </Panel>
        </aside>
      </section>
    </main>
  );
}
