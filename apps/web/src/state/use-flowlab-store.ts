"use client";

import { create } from "zustand";

export type LiveEvent = {
  id: string;
  at: string;
  severity: "info" | "warning" | "success" | "failure";
  message: string;
};

export type FlowLabState = {
  selectedDeviceId: string;
  selectedWorkflowId: string;
  drawerOpen: boolean;
  liveEvents: LiveEvent[];
  setSelectedDeviceId: (deviceId: string) => void;
  toggleDrawer: () => void;
  pushEvent: (event: LiveEvent) => void;
};

type StoreSetter = (
  partial:
    | Partial<FlowLabState>
    | ((state: FlowLabState) => Partial<FlowLabState>)
) => void;

const initialEvents: LiveEvent[] = [
  {
    id: "evt-1",
    at: "8s ago",
    severity: "success",
    message: "Preflight health completed on fin-srv-payroll-03"
  },
  {
    id: "evt-2",
    at: "38s ago",
    severity: "warning",
    message: "support-vdi-07 selected retry branch for patch install"
  },
  {
    id: "evt-3",
    at: "2m ago",
    severity: "info",
    message: "Blast-radius preview recalculated for Windows-Patch tag"
  }
];

export const useFlowLabStore = create<FlowLabState>((set: StoreSetter) => ({
  selectedDeviceId: "dev-006",
  selectedWorkflowId: "wf-patch-rollout",
  drawerOpen: true,
  liveEvents: initialEvents,
  setSelectedDeviceId: (deviceId: string) => set({ selectedDeviceId: deviceId }),
  toggleDrawer: () => set((state: FlowLabState) => ({ drawerOpen: !state.drawerOpen })),
  pushEvent: (event: LiveEvent) =>
    set((state: FlowLabState) => ({
      liveEvents: [event, ...state.liveEvents].slice(0, 8)
    }))
}));
