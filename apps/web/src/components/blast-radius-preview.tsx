"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, PlayCircle, ShieldCheck } from "lucide-react";
import { devices, workflows } from "@levelflow/mock-data";
import { previewBlastRadius } from "@levelflow/workflow-engine";
import { Badge, MetricCard, Panel, SectionHeading, StatusDot } from "./ui";

const workflow = workflows[0];
const preview = previewBlastRadius(workflow, devices);
const matched = devices.filter((device) => preview.matchedDevices.includes(device.id));
const excluded = devices.filter((device) =>
  preview.excludedDevices.some((excludedDevice) => excludedDevice.id === device.id)
);
const distribution = [
  { name: "Matched", value: matched.length, color: "#20d3c2" },
  { name: "Excluded", value: excluded.length, color: "#f6b94b" },
  { name: "Maintenance", value: devices.filter((device) => device.maintenanceMode).length, color: "#a978ff" }
];

export function BlastRadiusPreview() {
  return (
    <main className="screen-grid blast-screen">
      <div className="screen-title">
        <div>
          <div className="kicker">Blast radius preview</div>
          <h2>Windows Server Patch Rollout</h2>
          <p>Preview target scope, exclusions, risk posture, and estimated work before dispatch.</p>
        </div>
        <button className="app-button primary" type="button">
          <PlayCircle size={16} />
          Run Simulation
        </button>
      </div>

      <div className="metric-grid">
        <MetricCard label="Would run on" value="1,284" detail={`${matched.length} sample devices matched`} tone="cyan" />
        <MetricCard label="Excluded" value="88" detail={`${excluded.length} sample exclusions shown`} tone="amber" />
        <MetricCard label="Expected actions" value="5,136" detail="4 sequential actions per target" tone="blue" />
        <MetricCard label="Risk level" value={preview.riskLevel.toUpperCase()} detail="Reboot branch requires approval" tone="red" />
      </div>

      <section className="blast-layout">
        <Panel className="panel-inner">
          <SectionHeading kicker="Scope" title="Matched vs excluded" description="Maintenance mode and offline states are suppressed before run dispatch." />
          <div className="donut-layout blast-donut">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={distribution} dataKey="value" innerRadius={62} outerRadius={86} paddingAngle={4}>
                  {distribution.map((item) => (
                    <Cell fill={item.color} key={item.name} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#10141d", border: "1px solid rgba(255,255,255,0.12)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend-stack">
              {distribution.map((item) => (
                <div className="legend-row" key={item.name}>
                  <span style={{ background: item.color }} />
                  <strong>{item.name}</strong>
                  <em>{item.value}</em>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="panel-inner">
          <SectionHeading kicker="Why matched" title="Target explanation" description="Conditions used to build the preview cohort." />
          <div className="explain-stack">
            {workflow.targetConditions.map((condition) => (
              <div className="explain-item" key={condition.id}>
                <ShieldCheck size={16} />
                <span>{condition.label}</span>
              </div>
            ))}
            <div className="explain-item warning">
              <AlertTriangle size={16} />
              <span>Offline and maintenance-mode devices are excluded from patch dispatch.</span>
            </div>
          </div>
        </Panel>

        <Panel className="panel-inner">
          <SectionHeading kicker="Top impact" title="Groups and tags affected" description="The first approval pass should focus here." />
          <div className="impact-list">
            {["Finance / Servers", "Cobalt / POS", "Helio / VDI", "tag=Windows-Patch", "tag=SERVER"].map((item, index) => (
              <div className="impact-row" key={item}>
                <span>{item}</span>
                <strong>{[421, 338, 212, 1284, 488][index]}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel className="panel-inner">
        <SectionHeading kicker="Device preview" title="Sample device decisions" description="Matched and excluded examples with precise reasons." />
        <table className="data-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => {
              const exclusion = preview.excludedDevices.find((item) => item.id === device.id);
              return (
                <tr key={device.id}>
                  <td><strong>{device.name}</strong></td>
                  <td>{device.organization}</td>
                  <td>
                    <span className="status-cell">
                      <StatusDot tone={device.status === "online" ? "green" : device.status === "offline" ? "red" : "amber"} />
                      {device.status}
                    </span>
                  </td>
                  <td>{device.tags.slice(0, 3).join(", ")}</td>
                  <td>
                    {exclusion ? <Badge tone="amber">{exclusion.reason}</Badge> : <Badge tone="green">Matched target</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </main>
  );
}
