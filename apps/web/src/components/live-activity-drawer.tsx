"use client";

import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { type FlowLabState, useFlowLabStore } from "../state/use-flowlab-store";

const toneClass = {
  info: "blue",
  warning: "amber",
  success: "green",
  failure: "red"
};

export function LiveActivityDrawer() {
  const drawerOpen = useFlowLabStore((state: FlowLabState) => state.drawerOpen);
  const toggleDrawer = useFlowLabStore((state: FlowLabState) => state.toggleDrawer);
  const liveEvents = useFlowLabStore(
    (state: FlowLabState) => state.liveEvents
  ) as FlowLabState["liveEvents"];

  return (
    <section className={drawerOpen ? "live-drawer open" : "live-drawer"}>
      <button className="live-drawer-tab" onClick={toggleDrawer} type="button">
        <Activity size={15} />
        Live debug stream
        {drawerOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
      </button>
      {drawerOpen ? (
        <div className="live-drawer-events">
          {liveEvents.map((event: FlowLabState["liveEvents"][number]) => (
            <div className="live-event" key={event.id}>
              <span className={`dot ${toneClass[event.severity]}`} />
              <strong>{event.at}</strong>
              <p>{event.message}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
