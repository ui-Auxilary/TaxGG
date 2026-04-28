import type { ComponentType } from "react";
import { TaxCalculator } from "@/features/tax/TaxCalculator";

// A planner tool surfaced in the sidebar and routed to its own page.
// Add a tool by appending an entry here — no other file needs to change.
export interface ToolDefinition {
  id: string;
  label: string;
  path: string;
  component: ComponentType;
}

export const tools: ToolDefinition[] = [
  { id: "tax", label: "Income Tax", path: "/tax", component: TaxCalculator },
];
