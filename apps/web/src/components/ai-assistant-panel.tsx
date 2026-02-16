"use client";

import { Bot, ClipboardList, Lightbulb, Send, ShieldAlert, Sparkles } from "lucide-react";
import { aiInsights } from "@levelflow/mock-data";
import { Badge, Panel, SectionHeading } from "./ui";

const toneMap = {
  risk: "red",
  explain: "blue",
  optimize: "cyan",
  runbook: "purple"
} as const;

export function AiAssistantPanel() {
  return (
    <main className="ai-screen">
      <div className="screen-title">
        <div>
          <div className="kicker">AI assistant</div>
          <h2>Operational copilot</h2>
          <p>Explain automation behavior, summarize failures, and suggest safer rollout controls.</p>
        </div>
        <Badge tone="purple">
          <Sparkles size={13} />
          Context aware
        </Badge>
      </div>

      <section className="ai-layout">
        <Panel className="panel-inner ai-primary">
          <SectionHeading kicker="Suggested prompts" title="Ask about the staged rollout" description="Focused prompts are grounded in the selected workflow, target set, and last run." />
          <div className="prompt-grid">
            {aiInsights.map((insight) => (
              <button className="prompt-card" key={insight.id} type="button">
                <span>
                  {insight.tone === "risk" ? <ShieldAlert size={17} /> : insight.tone === "runbook" ? <ClipboardList size={17} /> : <Lightbulb size={17} />}
                </span>
                <strong>{insight.prompt}</strong>
                <small>{insight.title}</small>
              </button>
            ))}
          </div>

          <div className="assistant-thread">
            <div className="assistant-message user-message">
              <strong>Operator</strong>
              <p>Explain why the automation targeted these devices and what I should change before publishing.</p>
            </div>
            <div className="assistant-message ai-message">
              <strong>
                <Bot size={15} />
                FlowLab AI
              </strong>
              <p>
                The workflow matched Windows devices carrying the Windows-Patch tag, then excluded offline
                and maintenance-mode endpoints. The highest risk comes from the reboot branch and low connection
                quality in the Helio VDI cohort.
              </p>
              <div className="ai-recommendations">
                <Badge tone="amber">Add connectionQuality greater than 70</Badge>
                <Badge tone="red">Exclude No-Reboot before restart</Badge>
                <Badge tone="cyan">Run first on 10% sample cohort</Badge>
              </div>
            </div>
          </div>

          <label className="ai-composer">
            <input placeholder="Ask FlowLab AI about targeting, failures, variables, or safer rollout plans" />
            <button className="app-button primary" type="button">
              <Send size={15} />
              Ask
            </button>
          </label>
        </Panel>

        <aside className="ai-side">
          {aiInsights.map((insight) => (
            <Panel className="panel-inner insight-card" key={insight.id}>
              <div className="insight-top">
                <Badge tone={toneMap[insight.tone]}>{insight.tone}</Badge>
                <span>{Math.round(insight.confidence * 100)}% confidence</span>
              </div>
              <h3>{insight.title}</h3>
              <p>{insight.summary}</p>
            </Panel>
          ))}
        </aside>
      </section>
    </main>
  );
}
