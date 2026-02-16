import type { ReactNode } from "react";

type Tone = "blue" | "cyan" | "green" | "amber" | "red" | "purple";

export function Badge({
  children,
  tone = "blue"
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Panel({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export function SectionHeading({
  kicker,
  title,
  description,
  action
}: {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {kicker ? <div className="kicker">{kicker}</div> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "blue"
}: {
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
}) {
  return (
    <Panel className={`metric-card metric-card-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </Panel>
  );
}

export function StatusDot({ tone = "green" }: { tone?: "green" | "amber" | "red" }) {
  return <span className={`dot ${tone}`} aria-hidden="true" />;
}
