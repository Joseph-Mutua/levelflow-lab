"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  Bot,
  Braces,
  Gauge,
  GitBranch,
  History,
  MonitorSmartphone,
  PlayCircle,
  Search,
  Settings,
  ShieldCheck,
  Workflow
} from "lucide-react";
import type { ReactNode } from "react";
import { LiveActivityDrawer } from "./live-activity-drawer";

const navItems = [
  { href: "/", label: "Overview", icon: Gauge },
  { href: "/fleet", label: "Fleet", icon: MonitorSmartphone },
  { href: "/automations", label: "Automations", icon: Workflow },
  { href: "/blast-radius", label: "Simulation", icon: PlayCircle },
  { href: "/run-replay", label: "Run Replay", icon: History },
  { href: "/alerts", label: "Alerts / Monitors", icon: Bell },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <GitBranch size={18} />
          </span>
          <span>
            <strong>Level FlowLab</strong>
            <small>Automation staging</small>
          </span>
        </Link>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link className={active ? "nav-item active" : "nav-item"} href={item.href} key={item.href}>
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <div className="badge cyan">
            <span className="dot green" />
            Live fleet stream
          </div>
          <p>4,498 endpoints online across 24 customer organizations.</p>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <div className="kicker">Remote operations workspace</div>
            <h1>Simulation, blast radius, and run debugging</h1>
          </div>

          <div className="topbar-actions">
            <label className="global-search">
              <Search size={15} />
              <input placeholder="Search devices, runs, workflows" />
            </label>
            <button className="app-button secondary" type="button">
              <Braces size={15} />
              Export JSON
            </button>
            <button className="app-button primary" type="button">
              <ShieldCheck size={15} />
              Safe rollout
            </button>
          </div>
        </header>

        <div className="context-toolbar">
          <span className="badge blue">Org: All customers</span>
          <span className="badge cyan">Signal: realtime</span>
          <span className="badge amber">42 active warnings</span>
          <span className="toolbar-spacer" />
          <span className="activity-pulse">
            <Activity size={14} />
            Last event 8s ago
          </span>
        </div>

        <div className="workspace-content">{children}</div>
        <LiveActivityDrawer />
      </div>
    </div>
  );
}
