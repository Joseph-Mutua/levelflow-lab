"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { devices, fleetTrends, osDistribution, recentActivity } from "@levelflow/mock-data";
import { summarizeFleet } from "@levelflow/workflow-engine";
import { Badge, MetricCard, Panel, SectionHeading, StatusDot } from "./ui";

const osColors = ["#4f8cff", "#20d3c2", "#a978ff"];

export function FleetOverview() {
  const summary = summarizeFleet(devices);
  const riskyDevices = devices
    .filter((device) => device.alerts > 1 || device.securityScore < 75 || device.connectionQuality < 60)
    .slice(0, 5);

  return (
    <main className="screen-grid fleet-overview">
      <div className="screen-title">
        <div>
          <div className="kicker">Fleet overview</div>
          <h2>Live estate control center</h2>
          <p>Monitor device health, alert pressure, automation activity, and rollout readiness.</p>
        </div>
        <div className="filter-row">
          <Badge tone="blue">All organizations</Badge>
          <Badge tone="cyan">tag=Windows-Patch</Badge>
          <Badge tone="amber">status includes offline</Badge>
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard label="Managed devices" value="4,762" detail={`${summary.online} sample devices online`} tone="blue" />
        <MetricCard label="Online now" value="94.4%" detail="Live heartbeat across 24 orgs" tone="cyan" />
        <MetricCard label="Active alerts" value="118" detail={`${summary.alerts} from high-risk sample devices`} tone="amber" />
        <MetricCard label="Flagged endpoints" value="317" detail={`${summary.flagged} sample devices need review`} tone="red" />
      </div>

      <section className="fleet-grid-main">
        <Panel className="panel-inner chart-panel">
          <SectionHeading
            kicker="Realtime signal"
            title="Fleet health timeline"
            description="Online availability, offline drift, and alert pressure over the last six hours."
          />
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={fleetTrends}>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="label" stroke="#8e9bb3" tickLine={false} axisLine={false} />
                <YAxis stroke="#8e9bb3" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#10141d", border: "1px solid rgba(255,255,255,0.12)" }} />
                <Line dataKey="online" stroke="#20d3c2" strokeWidth={2.4} dot={false} />
                <Line dataKey="offline" stroke="#ff5e6c" strokeWidth={2.4} dot={false} />
                <Line dataKey="alerts" stroke="#f6b94b" strokeWidth={2.4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="panel-inner">
          <SectionHeading kicker="Platform mix" title="OS distribution" description="Current managed endpoint footprint." />
          <div className="donut-layout">
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={osDistribution} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={4}>
                  {osDistribution.map((entry, index) => (
                    <Cell fill={osColors[index]} key={entry.name} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="legend-stack">
              {osDistribution.map((item, index) => (
                <div className="legend-row" key={item.name}>
                  <span style={{ background: osColors[index] }} />
                  <strong>{item.name}</strong>
                  <em>{item.value}%</em>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </section>

      <section className="fleet-grid-secondary">
        <Panel className="panel-inner">
          <SectionHeading kicker="Risk queue" title="Unstable endpoints" description="Sorted by alert count, security posture, and connection quality." />
          <table className="data-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Org</th>
                <th>Status</th>
                <th>Score</th>
                <th>Alerts</th>
              </tr>
            </thead>
            <tbody>
              {riskyDevices.map((device) => (
                <tr key={device.id}>
                  <td>
                    <strong>{device.name}</strong>
                    <div className="muted-line">{device.tags.slice(0, 2).join(" / ")}</div>
                  </td>
                  <td>{device.organization}</td>
                  <td>
                    <span className="status-cell">
                      <StatusDot tone={device.status === "online" ? "green" : device.status === "offline" ? "red" : "amber"} />
                      {device.status}
                    </span>
                  </td>
                  <td>{device.securityScore}</td>
                  <td>{device.alerts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel className="panel-inner">
          <SectionHeading kicker="Automation pulse" title="Recent activity" description="Rollouts, remediations, and incident automation events." />
          <div className="activity-list">
            {recentActivity.map((item, index) => (
              <div className="activity-item" key={item}>
                <span className="activity-index">{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="panel-inner">
          <SectionHeading kicker="Organizations" title="Alert load by customer" description="Where operators should focus next." />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={[
                { org: "Northstar", alerts: 31 },
                { org: "Aster", alerts: 18 },
                { org: "Cobalt", alerts: 27 },
                { org: "Helio", alerts: 42 }
              ]}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="org" stroke="#8e9bb3" tickLine={false} axisLine={false} />
              <YAxis stroke="#8e9bb3" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#10141d", border: "1px solid rgba(255,255,255,0.12)" }} />
              <Bar dataKey="alerts" fill="#4f8cff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </section>
    </main>
  );
}
