declare module "@xyflow/react" {
  import type { ComponentType, ReactNode } from "react";

  export type Node<TData = Record<string, unknown>> = {
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: TData;
  };

  export type Edge = {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
    label?: ReactNode;
  };

  export type NodeProps<TNode extends Node = Node> = {
    data: TNode["data"];
  };

  export enum Position {
    Left = "left",
    Right = "right",
    Top = "top",
    Bottom = "bottom"
  }

  export const ReactFlow: ComponentType<{
    nodes: Node<unknown>[];
    edges: Edge[];
    nodeTypes?: Record<string, ComponentType<any>>;
    fitView?: boolean;
    minZoom?: number;
    maxZoom?: number;
    children?: ReactNode;
  }>;

  export const Background: ComponentType<{ color?: string; gap?: number }>;
  export const Controls: ComponentType;
  export const MiniMap: ComponentType<{
    pannable?: boolean;
    zoomable?: boolean;
    nodeStrokeColor?: string;
    nodeColor?: string;
    maskColor?: string;
  }>;
  export const Handle: ComponentType<{
    type: "source" | "target";
    position: Position;
  }>;
}
